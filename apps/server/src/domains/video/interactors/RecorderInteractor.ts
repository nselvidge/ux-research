import { Logger } from "@root/global/logger";
import { randomUUID } from "node:crypto";
import { inject, injectable } from "tsyringe";
import {
  addExternalIdToRecorder,
  createRecorder,
  RecorderType,
  RecordingTargetType,
  updateStatus,
} from "../entities/Recorder";

import {
  deserializeRecorder,
  PersistenceRecorder,
  serializeRecorder,
} from "./serializers/SerializedRecorder";

export interface RecordableProvider {
  getRecordableUrl: (joinDetails: {
    idToJoin: string;
    userId: string;
  }) => Promise<{
    joinUrl: string;
  }>;
}

export interface RecorderProvider {
  type: RecorderType;
  recordByUrl: (connectDetails: {
    url: string;
    userId: string;
    targetId: string;
  }) => Promise<{
    externalId: string;
    startTime: Date;
    title: string;
  }>;
  stopRecording: (externalId: string) => Promise<void>;
  getRecorderStatus: (
    externalId: string
  ) => Promise<"pending" | "recording" | "done">;
}

export type RecordableProviderFactory = (
  platform: RecordingTargetType
) => RecordableProvider;

export interface RecorderRepository {
  createRecorder: (recorder: PersistenceRecorder) => Promise<void>;
  maybeGetRecorderByTargetId: (
    targetId: string
  ) => Promise<PersistenceRecorder | null>;
  maybeGetRecorderByExternalId: (
    externalId: string
  ) => Promise<PersistenceRecorder | null>;
  updateRecorderProperties: (recorder: PersistenceRecorder) => Promise<void>;
}

export interface RecorderRepositories {
  recorders: RecorderRepository;
}

@injectable()
export class RecorderInteractor {
  constructor(
    @inject("Logger") private logger: Logger,
    @inject("RecordableProviderFactory")
    private recordableProviderFactory: RecordableProviderFactory,
    @inject("RecorderProvider") private recorderProvider: RecorderProvider,
    @inject("Repositories") private repositories: RecorderRepositories
  ) {}
  recordMeeting = async ({
    idToRecord,
    recordablePlatform,
    userId,
    workspaceId,
  }: {
    idToRecord: string;
    userId: string;
    recordablePlatform: RecordingTargetType;
    workspaceId: string;
  }) => {
    this.logger.info("Recording interview", {
      idToRecord,
      userId,
      workspaceId,
      recordablePlatform,
    });
    // get meeting provider
    const recordableProvider =
      this.recordableProviderFactory(recordablePlatform);

    // get meeting details from provider
    const { joinUrl } = await recordableProvider.getRecordableUrl({
      idToJoin: idToRecord,
      userId,
    });

    // create recorder with bot details
    let recorder = createRecorder({
      id: randomUUID(),
      type: this.recorderProvider.type,
      target: {
        type: recordablePlatform,
        id: idToRecord,
      },
      externalId: null,
    });

    // join meeting with bot provider
    const { externalId, title, startTime } =
      await this.recorderProvider.recordByUrl({
        url: joinUrl,
        userId,
        targetId: idToRecord,
      });

    recorder = addExternalIdToRecorder(recorder, externalId);
    await this.repositories.recorders.createRecorder(
      serializeRecorder(recorder)
    );

    // return recorderId
    return {
      recorder: serializeRecorder(recorder),
      title,
      startTime,
    };
  };

  maybeGetRecorderByTargetId = async ({
    targetId,
    type,
  }: {
    targetId: string;
    type: RecordingTargetType;
  }): Promise<PersistenceRecorder | null> => {
    return await this.repositories.recorders.maybeGetRecorderByTargetId(
      targetId
    );
  };

  stopRecording = async ({ targetId }: { targetId: string }): Promise<void> => {
    // get recorder
    let recorder = await this.repositories.recorders.maybeGetRecorderByTargetId(
      targetId
    );

    if (!recorder?.externalId) {
      this.logger.info("No recording to stop", {
        targetId,
      });
      return;
    }

    this.logger.info("Stopping recording", {
      targetId,
      recorderId: recorder.id,
    });

    await this.recorderProvider.stopRecording(recorder.externalId);

    recorder = deserializeRecorder(recorder);

    recorder = updateStatus(recorder, "done");

    await this.repositories.recorders.updateRecorderProperties(recorder);
  };

  getRecorderStatus = async ({
    targetId,
  }: {
    targetId: string;
  }): Promise<null | "pending" | "recording" | "done"> => {
    // get recorder
    let recorder = await this.repositories.recorders.maybeGetRecorderByTargetId(
      targetId
    );

    return recorder?.status || null;
  };

  updateRecorderStatus = async ({
    externalId,
    status,
  }: {
    externalId: string;
    status: "pending" | "recording" | "done";
  }): Promise<PersistenceRecorder | null> => {
    this.logger.info("Updating recorder status", {
      externalId,
      status,
    });
    // get recorder
    let recorder =
      await this.repositories.recorders.maybeGetRecorderByExternalId(
        externalId
      );

    if (!recorder?.externalId) {
      // if we receive a status update for a recorder that doesn't exist,
      // it probably was created by a different environment (dev, staging, prod)
      // so we should ignore it.
      this.logger.info("No recording", {
        externalId,
      });
      return null;
    }

    recorder = deserializeRecorder(recorder);

    if (recorder.status === status) {
      this.logger.info("Recorder status already up to date", {
        externalId,
        status,
      });
      return serializeRecorder(recorder);
    }

    recorder = updateStatus(recorder, status);

    await this.repositories.recorders.updateRecorderProperties(recorder);

    return serializeRecorder(recorder);
  };
}
