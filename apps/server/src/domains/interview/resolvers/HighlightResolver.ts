import { injectable } from "tsyringe";
import { Resolvers } from "@root/global/generated/graphql";

import { ResearcherInteractor } from "../interactors/ResearcherInteractor";
import { InterviewerInteractor } from "../interactors/InterviewerInteractor";
import { ConsumerInteractor } from "../interactors/ConsumerInteractor";
import { ViewerInteractor } from "@root/domains/video/interactors/ViewerInteractor";
import { MemberInteractor } from "@root/domains/auth/interactors/Member";
import { isHighlightWithInterviewDetails } from "../interactors/serializers/SerializedHighlight";

@injectable()
export class HighlightResolver {
  constructor(
    private researcher: ResearcherInteractor,
    private interviewer: InterviewerInteractor,
    private consumer: ConsumerInteractor,
    private viewer: ViewerInteractor,
    private member: MemberInteractor
  ) {}
  resolvers: Resolvers = {
    Highlight: {
      interview: async (highlight, _, { userId }) => {
        // This prevents us from running n+1 queries when listing out highlights
        if (isHighlightWithInterviewDetails(highlight)) {
          return highlight.interview;
        }

        const interview = await this.consumer.getInterviewByHighlightId(
          highlight.id
        );
        const workspace = await this.member.getWorkspace(interview.workspaceId);

        if (workspace.publicInterviewLinks) {
          return interview;
        }

        await this.consumer.ensureUserCanViewHighlight(userId, highlight.id);

        return interview;
      },
      video: async (highlight) => {
        return highlight.videoId
          ? this.viewer.getVideoById(highlight.videoId)
          : null;
      },
    },
    Query: {
      highlight: async (_, { id }, { userId }) => {
        const interview = await this.consumer.getInterviewByHighlightId(id);
        const workspace = await this.member.getWorkspace(interview.workspaceId);

        if (workspace.publicInterviewLinks) {
          return this.consumer.getHighlight(id);
        }

        await this.consumer.ensureUserCanViewHighlight(userId, id);

        return this.consumer.getHighlight(id);
      },
    },
    Mutation: {
      addHighlight: async (
        _,
        { interviewId, startWord, endWord, tagIds },
        { userId }
      ) => {
        await this.researcher.ensureUserIsResearcher(userId, interviewId);

        return this.researcher.highlightTranscript(
          interviewId,
          startWord,
          endWord,
          tagIds
        );
      },

      createTimestampHighlight: async (
        _,
        { interviewId, tagId },
        { userId }
      ) => {
        const timestamp = new Date();
        await this.interviewer.ensureUserIsInterviewer(userId, interviewId);

        return this.interviewer.addHighlightTimestamp(
          interviewId,
          timestamp,
          tagId || undefined
        );
      },

      addTagToHighlight: async (
        _,
        { interviewId, highlightId, tagId },
        { userId }
      ) => {
        await this.researcher.ensureUserIsResearcher(userId, interviewId);

        return this.researcher.addTagToHighlight(
          interviewId,
          tagId,
          highlightId
        );
      },

      addTagsToHighlight: async (
        _,
        { interviewId, highlightId, tagIds },
        { userId }
      ) => {
        await this.researcher.ensureUserIsResearcher(userId, interviewId);

        return this.researcher.addTagsToHighlight(
          interviewId,
          tagIds,
          highlightId
        );
      },

      removeTagsFromHighlight: async (
        _,
        { interviewId, highlightId, tagIds },
        { userId }
      ) => {
        await this.researcher.ensureUserIsResearcher(userId, interviewId);

        return this.researcher.removeTagsFromHighlight(
          interviewId,
          tagIds,
          highlightId
        );
      },

      updateHighlight: async (
        _,
        { interviewId, highlightId, startTime, endTime },
        { userId }
      ) => {
        await this.researcher.ensureUserIsResearcher(userId, interviewId);

        return this.researcher.updateHighlight(
          interviewId,
          highlightId,
          startTime,
          endTime
        );
      },
      removeHighlight: async (_, { interviewId, highlightId }, { userId }) => {
        await this.researcher.ensureUserIsResearcher(userId, interviewId);

        return this.researcher.removeHighlight(interviewId, highlightId);
      },

      addNewTagToHighlight: async (
        _,
        { interviewId, highlightId, tagName, emoji, color },
        { userId }
      ) => {
        await this.researcher.ensureUserIsResearcher(userId, interviewId);

        return this.researcher.addNewTagToHighlight(
          interviewId,
          highlightId,
          tagName,
          emoji,
          color
        );
      },
    },
  };
}
