import { injectable } from "tsyringe";
import { ConsumerInteractor } from "@root/domains/interview/interactors/ConsumerInteractor";
import { Resolvers } from "@root/global/generated/graphql";
import { InterviewerInteractor } from "../interactors/InterviewerInteractor";
import { MemberInteractor } from "@root/domains/auth/interactors/Member";
import { NotFoundError } from "@root/global/generated/prisma/runtime";
import { ResearcherInteractor } from "../interactors/ResearcherInteractor";
import { AdminInteractor } from "@root/domains/auth/interactors/Admin";
import { MinimalSerializedWordRange } from "../interactors/serializers/SerializedWordRange";
import { GatewayTag } from "../interactors/serializers/SerializedTag";
import { SerializedTranscript } from "../interactors/serializers/SerializedTranscript";
import { UploaderInteractor } from "../interactors/UploaderInteractor";
import { isInterviewWithoutTranscript } from "../interactors/serializers/SerializedInterview";
import { SuggestionManagementInteractor } from "../interactors/SuggestionManagementInteractor";
import { OrganizerInteractor } from "../interactors/OrganizerInteractor";
import { ProjectManagerInteractor } from "@root/domains/interview/interactors/ProjectManager";
import { AttendeeInteractor } from "../interactors/AttendeeInteractor";
import { RecorderInteractor } from "@root/domains/video/interactors/RecorderInteractor";

@injectable()
export class InterviewResolver {
  constructor(
    private consumer: ConsumerInteractor,
    private interviewer: InterviewerInteractor,
    private researcher: ResearcherInteractor,
    private member: MemberInteractor,
    private admin: AdminInteractor,
    private uploader: UploaderInteractor,
    private suggestionManager: SuggestionManagementInteractor,
    private organizer: OrganizerInteractor,
    private projectManager: ProjectManagerInteractor,
    private attendee: AttendeeInteractor,
    private recorder: RecorderInteractor
  ) {}
  resolvers: Resolvers = {
    Query: {
      interview: async (_, { id }, { userId }) => {
        const interview = await this.consumer.getInterview(id);
        const workspace = await this.member.getWorkspace(interview.workspaceId);
        if (workspace.publicInterviewLinks) {
          return interview;
        }

        await this.consumer.ensureUserIsConsumer(userId, id);

        return interview;
      },

      listInterviews: async (_, { workspaceId, projectId }, { userId }) => {
        if (!(await this.member.canViewWorkspace(userId, workspaceId))) {
          throw new NotFoundError("workspace not found");
        }

        return (await this.consumer.getInterviews(workspaceId, projectId)).sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      },

      getPendingInterview: async (_, { externalId }, { userId }) => {
        // This is how we get the interview from the zoom meeting for zoom V1
        // Zoom V2 will use the getPendingInterviewByRecordingTarget query
        // This is because we move to using a recording bot that is not
        // compatible with the initial permissions requested in v1 of the
        // zoom app.
        const interview = await this.interviewer.getPendingInterview(
          externalId,
          "zoom"
        );

        if (
          !interview ||
          !(await this.member.canViewWorkspace(userId, interview.workspaceId))
        ) {
          return null;
        }

        return interview;
      },

      getPendingInterviewByRecordingTarget: async (
        _,
        { externalId },
        { userId }
      ) => {
        const recorder = await this.recorder.maybeGetRecorderByTargetId({
          targetId: externalId,
          type: "zoom",
        });

        if (!recorder || !recorder.externalId) {
          return null;
        }

        const interview = await this.interviewer.getPendingInterview(
          recorder.externalId,
          "recall"
        );

        if (
          !interview ||
          !(await this.member.canViewWorkspace(userId, interview.workspaceId))
        ) {
          return null;
        }

        return interview;
      },
    },
    Mutation: {
      moveInterviewsToProject: async (
        _,
        { interviewIds, projectId },
        { userId }
      ) => {
        const workspace = await this.projectManager.getWorkspaceByProjectId(
          projectId
        );

        await this.admin.ensureUserCanEditWorkspace(userId, workspace.id);

        const project = await this.organizer.moveInterviewsToProject(
          interviewIds,
          projectId
        );

        return project;
      },

      removeInterviewFromProject: async (_, { interviewId }, { userId }) => {
        await this.interviewer.ensureUserIsInterviewer(userId, interviewId);

        return this.organizer.removeInterviewFromProject(interviewId);
      },

      updateInterviewName: async (_, { id, name }, { userId }) => {
        await this.interviewer.ensureUserIsInterviewer(userId, id);

        return this.interviewer.updateInterviewName(id, name);
      },

      archiveInterview: async (_, { interviewId }, { userId }) => {
        await this.interviewer.ensureUserIsInterviewer(userId, interviewId);

        return this.researcher.archiveInterview(interviewId);
      },

      createPendingInterview: async (
        _,
        { zoomId, workspaceId, projectId },
        { userId }
      ) => {
        if (!(await this.admin.canEditWorkspace(userId, workspaceId))) {
          throw new Error("workspace not found");
        }

        return this.interviewer.createPendingInterview({
          workspaceId,
          creatorId: userId,
          sourceId: zoomId,
          projectId: projectId || null,
          sourceLabel: "zoom",
        });
      },
      recordInterview: async (
        _,
        { zoomId, workspaceId, projectId },
        { userId }
      ) => {
        if (!(await this.admin.canEditWorkspace(userId, workspaceId))) {
          throw new Error("workspace not found");
        }

        return this.attendee.attendInterview({
          workspaceId,
          userId,
          meetingId: zoomId,
          meetingPlatform: "zoom",
          projectId: projectId || null,
        });
      },

      createUploadUrl: async (
        _,
        { workspaceId, interviewName, interviewDate },
        { userId }
      ) => {
        await this.admin.ensureUserCanEditWorkspace(userId, workspaceId);

        return this.uploader.createNewUploadInterview({
          workspaceId,
          interviewName,
          interviewDate,
          creatorId: userId,
        });
      },
      approveSuggestedHighlight: async (
        _,
        { interviewId, suggestedHighlightId },
        { userId }
      ) => {
        await this.interviewer.ensureUserIsInterviewer(userId, interviewId);

        return this.suggestionManager.handleApproveSuggestedHighlight(
          interviewId,
          suggestedHighlightId
        );
      },
      rejectSuggestedHighlight: async (
        _,
        { interviewId, suggestedHighlightId },
        { userId }
      ) => {
        await this.interviewer.ensureUserIsInterviewer(userId, interviewId);

        return this.suggestionManager.handleRejectSuggestedHighlight(
          interviewId,
          suggestedHighlightId
        );
      },
    },
    Project: {
      interviews: (project) => {
        return this.consumer.getInterviewsByProjectId(project.id);
      },
      interviewCount: (project) => {
        return this.consumer.getInterviewCountByProjectId(project.id);
      },
      interviewTags: (project) => this.organizer.getTagsForProject(project.id),
      highlightCounts: (project) =>
        this.organizer.getProjectHighlightCounts(project.id),
      taglessHighlightCounts: (project) =>
        this.organizer.getProjectTaglessHighlightCounts(project.id),
    },
    Interview: {
      currentUserCanEdit: (interview, _, { userId }) => {
        if (!isInterviewWithoutTranscript(interview)) {
          throw new Error(
            'query "currentUserCanEdit" not supported for current query'
          );
        }

        return this.admin.canEditWorkspace(userId, interview.workspaceId);
      },

      date: ({ createdAt }) => createdAt,

      recording: async (interview, _, { loaders }) =>
        isInterviewWithoutTranscript(interview) && interview.recordingId
          ? (await loaders.video.load(interview.recordingId)) || null
          : null,

      transcript: async (interview): Promise<null | SerializedTranscript> =>
        (isInterviewWithoutTranscript(interview) && interview.transcript) ||
        (await this.consumer.getTranscriptForInterview(interview.id)),

      workspace: (interview) => {
        if (!isInterviewWithoutTranscript(interview)) {
          throw new Error('field "workspace" not supported for current query');
        }

        return this.member.getWorkspace(interview.workspaceId);
      },

      highlights: (interview) => {
        if (!isInterviewWithoutTranscript(interview)) {
          throw new Error('field "highlights" not supported for current query');
        }

        return interview.highlights.filter(
          (
            highlight
          ): highlight is {
            id: string;
            highlightedRange: MinimalSerializedWordRange;
            tags: GatewayTag[];
            videoId: string;
            transcript: SerializedTranscript;
            originSuggestionId: string | null;
          } => !!highlight.highlightedRange
        );
      },

      suggestedHighlights: (interview) => {
        if (!isInterviewWithoutTranscript(interview)) {
          throw new Error(
            'field "suggestedHighlights" not supported for current query'
          );
        }

        return interview.suggestedHighlights.filter(
          (suggestion) => suggestion.status === "pending"
        );
      },

      creator: (interview) => {
        if (!isInterviewWithoutTranscript(interview)) {
          throw new Error('field "creator" not supported for current query');
        }

        return this.member.getMemberById(interview.creatorId);
      },

      pendingHighlights: (interview) => {
        if (!isInterviewWithoutTranscript(interview)) {
          throw new Error(
            'field "pendingHighlights" not supported for current query'
          );
        }

        return (
          interview.highlights.filter(
            (
              highlight
            ): highlight is {
              id: string;
              timestamp: Date;
              tags: GatewayTag[];
              videoId: null;
              transcript: null;
              originSuggestionId: null;
            } => !!highlight.timestamp
          ) || []
        );
      },
    },
  };
}
