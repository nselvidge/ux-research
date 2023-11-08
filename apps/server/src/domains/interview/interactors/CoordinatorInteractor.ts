/*
  Interactor responsible for coordinating the processing of an interview
  once it's been created by the interviewer. Manages asynchronous processing
  of the interview and the creation of the interview report.
*/

import { Logger } from "@root/global/logger";
import { inject, injectable } from "tsyringe";
import {
  addGeneratedSummaryToInterview,
  addSuggestedHighlightFromQuote,
  isInterview,
  isInterviewSourcePlatform,
} from "../entities/Interview";
import { InteractorRepositories } from "./InteractorRepositories";
import { VideoPublisher } from "./InteractorServices";
import { deserializeInterview } from "./serializers/SerializedInterview";
import { serializeSuggestedHighlightForPersistence } from "./serializers/SerializedSuggestedHighlight";

@injectable()
export class CoordinatorInteractor {
  constructor(
    @inject("Repositories") private repositories: InteractorRepositories,
    @inject("VideoPublisher") private videoPublisher: VideoPublisher,
    @inject("Logger") private logger: Logger
  ) {}
  onSummaryReady = async ({
    interviewId,
    summary,
  }: {
    interviewId: string;
    summary: string;
  }) => {
    this.logger.info("Received summary for interview", { interviewId });
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(interview)) {
      this.logger.error("Received summary for interview that is not ready", {
        interviewId,
      });
      return;
    }

    const event = addGeneratedSummaryToInterview(interview, summary);

    if (event.createSummary) {
      await this.repositories.interviews.addSummary(
        event.interview.id,
        event.interview.summary
      );
    } else if (event.updateSummary) {
      await this.repositories.interviews.updateSummary(
        event.interview.id,
        event.interview.summary
      );
    }

    return;
  };

  checkStaleInterviews = async () => {
    const staleInterviews =
      await this.repositories.interviews.getStaleInterviewsPendingRecording();

    for (const interview of staleInterviews) {
      this.logger.info("Found stale interview", { interviewId: interview.id });
      if (
        interview.source?.platform === "zoom" ||
        interview.source?.platform === "recall"
      ) {
        this.videoPublisher.publishCheckRecordingStatus({
          sourceId: interview.source.sourceId,
          userId: interview.creatorId,
          interviewId: interview.id,
          source: interview.source.platform,
        });
        continue;
      }

      if (interview.source?.platform === "upload") {
        this.videoPublisher.publishCheckUploadStatus({
          sourceId: interview.source.sourceId,
        });
        continue;
      }
    }
  };

  handleInterviewReady = async (externalId: string, sourceLabel: string) => {
    this.logger.info("handling interview ready");
    if (!isInterviewSourcePlatform(sourceLabel)) {
      throw new Error("must be a valid interview source");
    }

    const interview =
      await this.repositories.interviews.maybeGetPendingInterview(
        externalId,
        sourceLabel
      );

    if (!interview) {
      this.logger.info("interview not found");
      return;
    }
    this.logger.info("interview found", {
      interviewId: interview.id,
      externalId,
    });

    await this.videoPublisher.publishTransferVideoFromSource({
      externalId,
      userId: interview.creatorId,
      interviewId: interview.id,
      sourceLabel,
    });

    this.logger.info("published upload recording");
    return;
  };

  handleQuotesExtracted = async ({
    quotes,
    documentId: interviewId,
  }: {
    quotes: {
      quote: string;
      tag: string;
    }[];
    documentId: string;
  }) => {
    this.logger.info("handling quotes extracted", {
      interviewId,
    });
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(interview)) {
      this.logger.error("Received quotes for interview that is not ready", {
        interviewId,
      });
      throw new Error("Received quotes for interview that is not ready");
    }

    const tags = await this.repositories.tags.getTagsForWorkspace(
      interview.workspaceId
    );

    for (const current of quotes) {
      this.logger.info("handling quote for tag", {
        interviewId,
        tagId: current.tag,
      });

      const { quote, tag: tagId } = current;
      const tag = tags.find((t) => t.id === tagId);
      if (!tag) {
        this.logger.error("Received quotes for interview with invalid tag", {
          interviewId,
          tagId,
        });
        throw new Error("Received quotes for interview with invalid tag");
      }

      const event = addSuggestedHighlightFromQuote(interview, quote, tag);
      //persist the new transcript
      if (event.suggestedHighlight) {
        this.logger.info("persisting suggested highlight", {
          interviewId,
          suggestedHighlightId: event.suggestedHighlight.id,
        });
        await this.repositories.suggestedHighlights.createSuggestedHighlight(
          event.interview.id,
          event.interview.transcript.id,
          serializeSuggestedHighlightForPersistence(event.suggestedHighlight)
        );
        this.logger.info("persisted suggested highlight", {
          interviewId,
          suggestedHighlightId: event.suggestedHighlight?.id,
        });
      } else {
        this.logger.info("Could not find quote in transcript", {
          interviewId,
          quote,
        });
      }
    }

    this.logger.info("quotes extracted", {
      interviewId,
    });

    return;
  };
}
