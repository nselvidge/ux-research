/* ConsumerInteractor
 * Handles all business logic for consumers of interviews
 * Consumers are users who can view interviews, but not edit them
 */
import { MemberInteractor } from "@root/domains/auth/interactors/Member";
import { ViewerInteractor } from "@root/domains/video/interactors/ViewerInteractor";
import { Logger } from "@root/global/logger";
import { inject, injectable } from "tsyringe";
import { interviewIsStale, isInterview } from "../entities/Interview";
import { InteractorRepositories } from "./InteractorRepositories";
import {
  MinimalSerializedHighlight,
  serializeGatewayHighlight,
} from "./serializers/SerializedHighlight";
import {
  deserializeInterview,
  serializeInterview,
} from "./serializers/SerializedInterview";

@injectable()
export class ConsumerInteractor {
  constructor(
    @inject("Repositories")
    private repositories: InteractorRepositories,
    private member: MemberInteractor,
    private viewer: ViewerInteractor,
    @inject("Logger") private logger: Logger
  ) {}

  ensureUserIsConsumer = async (
    userId: string,
    interviewId: string
  ): Promise<void> => {
    const interview =
      await this.repositories.interviews.getInterviewWithoutTranscript(
        interviewId
      );

    if (!(await this.member.canViewWorkspace(userId, interview.workspaceId))) {
      throw new Error("workspace not found");
    }
    return;
  };

  ensureUserCanViewHighlight = async (userId: string, highlightId: string) => {
    const workspaceId =
      await this.repositories.interviews.getWorkspaceIdForHighlight(
        highlightId
      );

    if (!(await this.member.canViewWorkspace(userId, workspaceId))) {
      throw new Error("workspace not found");
    }
    return;
  };

  ensureUserCanViewTag = async (userId: string, tagId: string) => {
    const workspaceId = await this.repositories.tags.getWorkspaceIdForTag(
      tagId
    );

    if (!(await this.member.canViewWorkspace(userId, workspaceId))) {
      throw new Error("workspace not found");
    }

    return;
  };

  getHighlight = async (highlightId: string) => {
    const interview = await this.repositories.interviews
      .getInterviewByHighlightId(highlightId)
      .then(deserializeInterview);

    if (!isInterview(interview)) {
      throw new Error("Can only get a highlight from a ready interview");
    }

    const highlight = interview.highlights.find(
      (highlight) => highlight.id === highlightId
    );

    if (!highlight) {
      throw new Error("highlight not found");
    }

    return serializeGatewayHighlight(highlight);
  };

  getHighlightsForTag = async (
    tagId: string,
    projectId?: string | null
  ): Promise<MinimalSerializedHighlight[]> => {
    const highlights =
      await this.repositories.interviews.getNonPendingHighlightByTagId(
        tagId,
        projectId
      );

    return highlights;
  };

  getTaglessHighlights = async (
    workspaceId: string,
    projectId?: string | null
  ): Promise<MinimalSerializedHighlight[]> => {
    const highlights =
      await this.repositories.interviews.getNonPendingTaglessHighlights(
        workspaceId,
        projectId
      );

    return highlights;
  };

  async getInterview(id: string) {
    const interview = await this.repositories.interviews
      .getInterviewById(id)
      .then(deserializeInterview);

    const staleTime = 1000 * 60 * 60 * 2; // 2 hours
    if (interviewIsStale(interview, staleTime)) {
      this.logger.warn(`Interview is stale.`, {
        interviewId: id,
        createdAt: interview.createdAt,
        sourceId: interview.source?.sourceId,
      });
    }

    return serializeInterview(interview);
  }

  async getInterviews(workspaceId: string, projectId?: string | null) {
    return this.repositories.interviews.getUnarchivedForWorkspace(
      workspaceId,
      projectId
    );
  }

  getRecordingById = async (recordingId: string) =>
    this.viewer.getVideoById(recordingId);

  getTranscriptForInterview = async (interviewId: string) =>
    (
      await this.repositories.interviews
        .getInterviewById(interviewId)
        .then(deserializeInterview)
        .then(serializeInterview)
    ).transcript;

  getInterviewByHighlightId = async (highlightId: string) =>
    this.repositories.interviews
      .getInterviewByHighlightId(highlightId)
      .then(deserializeInterview)
      .then(serializeInterview);

  getParticipant = async (participantId: string) =>
    this.repositories.participants.getById(participantId);

  getInterviewsByProjectId = async (projectId: string) =>
    this.repositories.interviews.getInterviewsByProjectId(projectId);

  getInterviewCountByProjectId = async (projectId: string) =>
    this.repositories.interviews.getInterviewCountByProjectId(projectId);

  getWorkspaceStats = async (workspaceId: string) =>
    this.repositories.interviews.getWorkspaceStats(workspaceId);
}
