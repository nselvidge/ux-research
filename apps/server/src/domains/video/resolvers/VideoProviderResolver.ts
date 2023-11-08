import { NotFoundError } from "@root/global/generated/prisma/runtime";
import { AdminInteractor } from "@root/domains/auth/interactors/Admin";
import { InterviewerInteractor } from "@root/domains/interview/interactors/InterviewerInteractor";
import { Resolvers } from "@root/global/generated/graphql";
import { inject, injectable } from "tsyringe";
import { CreatorInteractor } from "../interactors/CreatorInteractor";
import { ZoomService, ZoomServiceFactory } from "../services/ZoomService";
import { ZoomAuth, ZoomAuthFactory } from "@root/domains/auth/services/ZoomAuth";
import { ViewerInteractor } from "../interactors/ViewerInteractor";
import { VideoPlaybackServices } from "../services/VideoPlaybackServices";
import { RecorderInteractor } from "../interactors/RecorderInteractor";
import { MemberInteractor } from "@root/domains/auth/interactors/Member";
import { ZoomVersions } from "@root/global/ZoomCredentialManager";

export interface VideoStorageService {
  getUrlForVideo: (id: string) => Promise<string>;
}

@injectable()
export class VideoProviderResolver {
  constructor(
    private creator: CreatorInteractor,
    private interviewer: InterviewerInteractor,
    private admin: AdminInteractor,
    private videoPlayback: VideoPlaybackServices,
    private viewer: ViewerInteractor,
    private recorder: RecorderInteractor,
    private member: MemberInteractor,
    private zoomAuthFactory: ZoomAuthFactory,
    private zoomServiceFactory: ZoomServiceFactory
  ) {}
  resolvers: Resolvers = {
    Video: {
      url: (parent) =>
        parent.playableAsset
          ? this.videoPlayback
              .getPlaybackService(parent.playableAsset.platform)
              .getPlayableUrlForVideo(
                parent.playableAsset.id,
                parent.playableAsset.isSigned
              )
          : null,
      previewImageUrl: (parent) =>
        parent.editableAsset?.playbackId
          ? this.viewer.getPreviewImageUrl(
              parent.editableAsset.playbackId,
              parent.editableAsset.isSigned
            )
          : null,
      previewGifUrl: (parent) =>
        parent.editableAsset?.playbackId
          ? this.viewer.getPreviewGifUrl(
              parent.editableAsset.playbackId,
              parent.editableAsset.isSigned
            )
          : null,
    },
    Query: {
      isConnectedToZoom: async (_, __, { userId }) => {
        const zoomAuth = await this.zoomAuthFactory.getZoomAuthByUserId(userId);

        if (!zoomAuth) {
          return false;
        }

        return zoomAuth.userIsAuthorized(userId)
      },
      zoomRecordingList: async (_, __, { userId }) => {
        const zoomAuth = await this.zoomAuthFactory.getZoomAuthByUserId(userId);
        if (!zoomAuth) {
          return null;
        }

        const zoomService = this.zoomServiceFactory.getZoomService(zoomAuth.getZoomType().replace("zoom", "") as ZoomVersions);

        return this.creator.getRecordingsForProvider(zoomService, userId)
      },
      recordingStatus: (_, { meetingId }, { userId }) =>
        this.recorder.getRecorderStatus({ targetId: meetingId }),
    },
    Mutation: {
      stopRecording: async (_, { meetingId }, { userId }) => {
        const recorder = await this.recorder.maybeGetRecorderByTargetId({
          targetId: meetingId,
          type: "zoom",
        });

        if (!recorder || !recorder.externalId) {
          return true;
        }

        const interview = await this.interviewer.getPendingInterview(
          recorder.externalId,
          "recall"
        );

        if (
          !interview ||
          !(await this.member.canViewWorkspace(userId, interview.workspaceId))
        ) {
          return true;
        }

        await this.recorder.stopRecording({ targetId: meetingId });

        return true;
      },
      importInterviewFromZoom: async (
        _,
        { externalId, workspaceId },
        { userId }
      ) => {
        if (!(await this.admin.canEditWorkspace(userId, workspaceId))) {
          throw new NotFoundError("workspace not found");
        }

        if (!(await this.creator.videoIsReady(externalId, userId, "zoom"))) {
          throw new Error("Video is not ready to import. Try again later.");
        }

        return this.interviewer.importRecordedInterview(
          externalId,
          userId,
          "zoom",
          workspaceId
        );
      },
    },
  };
}
