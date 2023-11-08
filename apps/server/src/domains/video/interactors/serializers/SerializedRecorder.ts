import {
  Recorder,
  RecorderStatus,
  RecorderType,
  RecordingTargetType,
} from "../../entities/Recorder";

export interface PersistenceRecorder {
  id: string;
  type: RecorderType;
  target: {
    type: RecordingTargetType;
    id: string;
  };
  error: string | null;
  externalId: string | null;
  status: RecorderStatus;
}

export const serializeRecorder = ({
  id,
  type,
  target,
  error,
  externalId,
  status
}: Recorder): PersistenceRecorder => ({
  id,
  type,
  target,
  error,
  externalId,
  status
});

export const deserializeRecorder = ({
  id,
  type,
  target,
  error,
  externalId,
  status
}: PersistenceRecorder): Recorder => ({
  id,
  type,
  target,
  error,
  externalId,
  status
});
