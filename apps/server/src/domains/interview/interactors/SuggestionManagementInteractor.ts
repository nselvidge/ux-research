import { Logger } from "@root/global/logger";
import { inject, injectable } from "tsyringe";
import {
  approveSuggestedHighlight,
  isInterview,
  rejectSuggestedHighlight,
} from "../entities/Interview";
import { InteractorRepositories } from "./InteractorRepositories";
import { ResearcherInteractor } from "./ResearcherInteractor";
import {
  deserializeInterview,
  serializeInterview,
} from "./serializers/SerializedInterview";
import { serializeTranscript } from "./serializers/SerializedTranscript";

@injectable()
export class SuggestionManagementInteractor {
  constructor(
    @inject("Logger") private logger: Logger,
    @inject("Repositories") private repositories: InteractorRepositories,
    private researcher: ResearcherInteractor
  ) {}

  handleApproveSuggestedHighlight = async (
    interviewId: string,
    suggestedHighlightId: string
  ) => {
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(interview)) {
      this.logger.error(
        "Cannot approve suggestion for interview that is not ready",
        {
          interviewId,
          suggestedHighlightId,
        }
      );
      throw new Error(
        "Cannot approve suggestion for interview that is not ready"
      );
    }

    const event = approveSuggestedHighlight(interview, suggestedHighlightId);

    await this.repositories.interviews.addHighlight({
      interviewId: interview.id,
      interviewTranscriptId: interview.transcript.id,
      id: event.highlight.id,
      highlightedRange: event.highlight.highlightedRange,
      tags: event.highlight.tags,
      transcript: serializeTranscript(event.highlight.transcript),
      originSuggestionId: event.highlight.originSuggestionId,
    });

    const { interview: interviewWithHighlightClip } =
      await this.researcher.createClipFromHighlight(
        event.interview,
        event.highlight.id
      );

    await this.repositories.suggestedHighlights.updateSuggestedHighlightStatus(
      event.suggestedHighlight.id,
      event.suggestedHighlight.status
    );

    return serializeInterview(interviewWithHighlightClip);
  };

  handleRejectSuggestedHighlight = async (
    interviewId: string,
    suggestedHighlightId: string
  ) => {
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(interview)) {
      this.logger.error(
        "Cannot approve suggestion for interview that is not ready",
        {
          interviewId,
          suggestedHighlightId,
        }
      );
      throw new Error(
        "Cannot approve suggestion for interview that is not ready"
      );
    }

    const event = rejectSuggestedHighlight(interview, suggestedHighlightId);

    await this.repositories.suggestedHighlights.updateSuggestedHighlightStatus(
      event.suggestedHighlight.id,
      event.suggestedHighlight.status
    );

    return serializeInterview(event.interview);
  };
}
