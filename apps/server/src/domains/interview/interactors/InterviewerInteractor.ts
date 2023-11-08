/*
InterviewerInteractor

Interactor responsible for managing the process of running and creating an interview.
*/

import { AdminInteractor } from "@root/domains/auth/interactors/Admin";
import { MemberInteractor } from "@root/domains/auth/interactors/Member";
import { EditorInteractor } from "@root/domains/video/interactors/EditorInteractor";

import { ViewerInteractor } from "@root/domains/video/interactors/ViewerInteractor";
import { Tracker } from "@root/global/tracker";
import { randomUUID } from "crypto";
import pino from "pino";
import { inject, injectable } from "tsyringe";
import { addVideoIdToHighlight } from "../entities/Highlight";
import {
  Interview,
  isInterviewPendingRecording,
  isInterviewPendingTranscript,
  isInterviewSourcePlatform,
  PendingRecordingInterview,
  isInterview,
  InterviewStatus,
  updateName,
  addRecordingToPendingInterview,
  addTimestampHighlightToPendingInterview,
  addCompletedTranscriptToInterview,
  updateHighlightsOnInterview,
} from "../entities/Interview";
import { Tag } from "../entities/Tag";
import {
  parseRawTranscriptGroups,
  RawTranscript,
} from "../entities/Transcript";
import { InteractorRepositories } from "./InteractorRepositories";
import {
  TranscriptionService,
  VideoPublisher,
  VideoSourceService,
  InterviewNotificationService,
  InterviewPublisher,
} from "./InteractorServices";
import {
  deserializeInterview,
  serializeInterview,
} from "./serializers/SerializedInterview";
import { deserializeTag } from "./serializers/SerializedTag";
import {
  deserializeRawTranscript,
  serializeTranscript,
} from "./serializers/SerializedTranscript";
import { serializeWordRange } from "./serializers/SerializedWordRange";

export type ImportSources = "zoom" | "recall" | "zoomV2";

export type VideoSourceFactory = (label: ImportSources) => VideoSourceService;

export const isImportSources = (label: string): label is ImportSources =>
  ["zoom", "recall", "zoomV2"].includes(label);

@injectable()
export class InterviewerInteractor {
  constructor(
    @inject("Repositories")
    private repositories: InteractorRepositories,
    @inject("TranscriptionService")
    private transcriptionService: TranscriptionService,
    @inject("VideoPublisher") private videoPublisher: VideoPublisher,
    @inject("InterviewPublisher")
    private interviewPublisher: InterviewPublisher,
    private admin: AdminInteractor,
    @inject("VideoSourceFactory")
    private getVideoSource: VideoSourceFactory,
    @inject("Logger") private logger: pino.Logger,
    @inject("InterviewNotificationService")
    private notifier: InterviewNotificationService,
    private editor: EditorInteractor,
    private member: MemberInteractor,
    private viewer: ViewerInteractor,
    private tracker: Tracker
  ) {}

  ensureUserIsInterviewer = async (
    userId: string,
    interviewId: string
  ): Promise<void> => {
    const interview =
      await this.repositories.interviews.getInterviewWithoutTranscript(
        interviewId
      );

    if (!(await this.admin.canEditWorkspace(userId, interview.workspaceId))) {
      throw new Error("workspace not found");
    }
    return;
  };

  async importRecordedInterview(
    externalId: string,
    userId: string,
    sourceLabel: ImportSources,
    workspaceId: string
  ) {
    this.logger.debug("creating interview");
    const videoSource = this.getVideoSource(sourceLabel);

    const name = await videoSource.getVideoName(userId, externalId);
    const date = await videoSource.getVideoDate(userId, externalId);

    const interview: PendingRecordingInterview = {
      status: InterviewStatus.PendingRecording,
      id: randomUUID(),
      name,
      workspaceId,
      highlights: [],
      date,
      creatorId: userId,
      createdAt: new Date(),
      source: { platform: sourceLabel, sourceId: externalId },
      projectId: null,
    };

    await this.repositories.interviews.createInterview(
      serializeInterview(interview)
    );

    await this.videoPublisher.publishTransferVideoFromSource({
      externalId,
      userId,
      interviewId: interview.id,
      sourceLabel,
    });

    return serializeInterview(interview);
  }

  updateInterviewName = async (id: string, nextName: string) => {
    this.logger.debug("updating interview name");
    let interview = await this.repositories.interviews
      .getInterviewById(id)
      .then(deserializeInterview);

    interview = updateName(interview, nextName);

    await this.repositories.interviews.updateName(interview.id, interview.name);
    return serializeInterview(interview);
  };

  handleReadyTranscript = async (rawTranscript: RawTranscript) => {
    const event = parseRawTranscriptGroups(rawTranscript);

    await this.repositories.participants.addParticipants(event.speakers);
    return event.transcript;
  };

  addRecordingToInterview = async (
    interviewId: string,
    startTime: Date,
    recordingId: string
  ) => {
    const pendingInterview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterviewPendingRecording(pendingInterview)) {
      this.logger.error("Interview already has a recording", {
        interviewId,
        currentRecordingId: pendingInterview.recordingId,
        recordingId,
        interviewStatus: pendingInterview.status,
      });
      return;
    }

    const recordingDownloadUrl = await this.viewer.getDownloadUrl(recordingId);

    const transcriptResult = await this.transcriptionService
      .generateTranscript(recordingDownloadUrl)
      .then(deserializeRawTranscript);

    const transcript = !transcriptResult.isPending
      ? await this.handleReadyTranscript(transcriptResult)
      : transcriptResult;

    this.logger.info({
      message: "transcript created",
      transcriptId: transcript.id,
      interviewId: pendingInterview.id,
    });

    const interview = addRecordingToPendingInterview(
      pendingInterview,
      recordingId,
      startTime,
      transcript
    );

    await this.repositories.interviews.addRecording(
      serializeInterview(interview),
      recordingId
    );

    await this.repositories.transcripts.createTranscriptForInterview(
      interviewId,
      serializeTranscript(transcript)
    );
  };

  createPendingInterview = async ({
    workspaceId,
    creatorId,
    sourceId,
    sourceLabel,
    projectId,
    name,
    date,
  }: {
    workspaceId: string;
    creatorId: string;
    sourceId: string;
    sourceLabel: ImportSources;
    projectId: string | null;
    name?: string;
    date?: Date;
  }) => {
    const source = this.getVideoSource(sourceLabel);

    name = name || (await source.getPendingVideoName(creatorId, sourceId));
    date = date || (await source.getPendingVideoDate(creatorId, sourceId));

    // Check to ensure no interview with this source already exists
    const existingInterview =
      await this.repositories.interviews.maybeGetPendingInterview(
        sourceId,
        sourceLabel
      );

    if (existingInterview) {
      return serializeInterview(deserializeInterview(existingInterview));
    }

    const interview: PendingRecordingInterview = {
      id: randomUUID(),
      status: InterviewStatus.PendingRecording,
      name,
      workspaceId,
      highlights: [],
      date,
      createdAt: new Date(),
      source: isInterviewSourcePlatform(sourceLabel)
        ? { platform: sourceLabel, sourceId }
        : null,
      creatorId,
      projectId,
    };

    await this.repositories.interviews.createInterview(
      serializeInterview(interview)
    );

    this.tracker.trackEvent(
      "Pending Interview Created",
      {
        interviewId: interview.id,
      },
      creatorId
    );

    return serializeInterview(interview);
  };

  addHighlightTimestamp = async (
    interviewId: string,
    timestamp: Date,
    tagId?: string
  ) => {
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterviewPendingRecording(interview)) {
      throw new Error(
        "can only add timestamp highlights to interviews pending a recording"
      );
    }

    const tag = tagId
      ? await this.repositories.tags.getTagById(tagId).then(deserializeTag)
      : undefined;

    if (tag && tag.workspaceId !== interview.workspaceId) {
      throw new Error(
        "Invalid tag, must be part of the same workspace as interview"
      );
    }

    const [updatedInterview, event] = addTimestampHighlightToPendingInterview(
      interview,
      timestamp,
      tag
    );

    await this.repositories.interviews.addTimestampHighlight(event);
    this.tracker.trackEvent(
      "Highlight Created",
      {
        interviewId: updatedInterview.id,
        highlightId: event.highlight.id,
        source: "timestamp",
      },
      updatedInterview.creatorId
    );
    return serializeInterview(updatedInterview);
  };

  getPendingInterview = async (sourceId: string, sourceLabel: string) => {
    if (!isInterviewSourcePlatform(sourceLabel)) {
      throw new Error("must be a valid interview source");
    }

    const pendingInterview =
      await this.repositories.interviews.maybeGetPendingInterview(
        sourceId,
        sourceLabel
      );

    if (!pendingInterview) {
      return;
    }

    return serializeInterview(deserializeInterview(pendingInterview));
  };

  private updateHighlightClips = async (interview: Interview) => {
    const recording = await this.viewer.getVideoById(interview.recordingId);

    if (recording.editableAsset?.status !== "completed") {
      return interview.highlights;
    }

    return Promise.all(
      interview.highlights.map(async (highlight) => {
        // create a clip for each highlight
        const video = await this.editor.createClip(
          interview.recordingId,
          highlight.highlightedRange.startWord.start,
          highlight.highlightedRange.endWord.end
        );

        const highlightWithClip = addVideoIdToHighlight(highlight, video.id);

        await this.repositories.interviews.addVideoToHighlight(
          highlightWithClip.id,
          video.id
        );

        return highlightWithClip;
      })
    );
  };

  private notifyIfInterviewReady = async (interview: Interview) => {
    const recording = await this.viewer.getVideoById(interview.recordingId);
    if (recording.editableAsset?.status !== "completed") {
      return;
    }

    const creator = await this.member.getMemberById(interview.creatorId);

    const previewImageUrl = await this.viewer.getPreviewImageUrlForVideo(
      recording.id
    );

    await this.notifier.sendInterviewReadyNotification({
      interviewId: interview.id,
      fullName: creator.fullName,
      userId: creator.id,
      highlightCount: interview.highlights.length,
      interviewName: interview.name,
      previewImageUrl: previewImageUrl,
    });
  };

  handleTranscriptReady = async (transcriptId: string) => {
    const rawTranscript = await this.transcriptionService
      .getTranscriptById(transcriptId)
      .then(deserializeRawTranscript);

    const interview = await this.repositories.interviews
      .getInterviewByTranscriptId(transcriptId)
      .then(deserializeInterview);

    if (rawTranscript.isPending) {
      throw new Error("transcript is not ready");
    }

    if (!isInterviewPendingTranscript(interview)) {
      this.logger.warn(
        `transcript ready for interview ${interview.id} that is not pending a transcript`
      );
      return;
    }

    const recording = await this.viewer.getVideoById(interview.recordingId);

    const event = parseRawTranscriptGroups(rawTranscript);

    await this.repositories.participants.addParticipants(event.speakers);

    const transcript = event.transcript;

    const updatedInterview = addCompletedTranscriptToInterview(
      interview,
      transcript,
      recording.startTime
    );

    await this.repositories.transcripts.addGroups(
      serializeTranscript(updatedInterview.transcript)
    );

    await Promise.all(
      updatedInterview.highlights.map((highlight) =>
        this.repositories.interviews.addHighlightTranscript(
          highlight.id,
          serializeWordRange(highlight.highlightedRange),
          serializeTranscript(highlight.transcript)
        )
      )
    );

    const updatedHighlights = await this.updateHighlightClips(updatedInterview);

    const finalInterview = updateHighlightsOnInterview(
      updatedInterview,
      updatedHighlights
    );

    this.interviewPublisher.publishGenerateSummary({
      interviewId: finalInterview.id,
      transcript: serializeTranscript(finalInterview.transcript),
      speakers: event.speakers,
    });

    const workspaceTags = await this.repositories.tags
      .getTagsForWorkspace(finalInterview.workspaceId)
      .then((tags) => tags.map(deserializeTag));

    const tagsToExtract = workspaceTags.filter(
      (tag): tag is { description: string } & Tag =>
        tag.autoExtract && tag.description !== null
    );

    await this.interviewPublisher.publishExtractQuotes({
      tags: tagsToExtract.map((tag) => ({
        id: tag.id,
        name: tag.name,
        description: tag.description,
      })),
      interviewId: finalInterview.id,
      transcript: serializeTranscript(finalInterview.transcript),
      speakers: event.speakers,
    });

    await this.notifyIfInterviewReady(finalInterview);

    return serializeInterview(finalInterview);
  };

  handleInterviewVideoEditable = async (videoId: string) => {
    const interviewData =
      await this.repositories.interviews.getInterviewByVideoId(videoId);

    const interview = interviewData
      ? deserializeInterview(interviewData)
      : null;

    if (!interview || !isInterview(interview)) {
      return;
    }

    // create highlight clips
    await this.updateHighlightClips(interview);

    // notify if interview is ready
    await this.notifyIfInterviewReady(interview);
  };
}
