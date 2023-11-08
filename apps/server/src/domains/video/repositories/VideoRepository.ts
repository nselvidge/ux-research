import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import { CreatorVideoRepository } from "../interactors/CreatorInteractor";
import { EditorVideoRepository } from "../interactors/EditorInteractor";
import { PersistenceVideo } from "../interactors/serializers/SerializedVideo";
import { ViewerVideoRepository } from "../interactors/ViewerInteractor";

@injectable()
export class VideoRepository
  implements
    ViewerVideoRepository,
    CreatorVideoRepository,
    EditorVideoRepository
{
  private defaultIncludes = {
    editableAsset: true,
    playableAsset: true,
    recorder: {
      include: {
        target: true,
      },
    },
  };
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}
  createVideo = async ({
    id,
    startTime,
    playableAsset,
    editableAsset,
  }: PersistenceVideo) =>
    this.prisma.video.create({
      data: {
        id,
        startTime,
        editableAsset: editableAsset
          ? {
              create: {
                id: editableAsset.id,
                status: editableAsset.status,
                playbackId: editableAsset.playbackId,
                isSigned: editableAsset.isSigned,
              },
            }
          : undefined,
        playableAsset: playableAsset
          ? {
              create: {
                id: playableAsset.id,
                platform: playableAsset.platform,
                isSigned: playableAsset.isSigned,
              },
            }
          : undefined,
      },
      include: this.defaultIncludes,
    });
  addEditableAsset = async (video: PersistenceVideo) =>
    this.prisma.video.update({
      where: { id: video.id },
      data: {
        editableAsset: video.editableAsset
          ? {
              create: {
                id: video.editableAsset.id,
                status: video.editableAsset.status,
                playbackId: video.editableAsset.playbackId,
                isSigned: video.editableAsset.isSigned,
              },
            }
          : undefined,
      },
      include: this.defaultIncludes,
    });

  updateEditableAsset = async (video: PersistenceVideo) =>
    this.prisma.video.update({
      where: { id: video.id },
      data: {
        editableAsset: video.editableAsset
          ? {
              update: {
                id: video.editableAsset.id,
                status: video.editableAsset.status,
                playbackId: video.editableAsset.playbackId,
                isSigned: video.editableAsset.isSigned,
              },
            }
          : undefined,
      },
      include: this.defaultIncludes,
    });

  addPlayableAsset = async (video: PersistenceVideo) =>
    this.prisma.video.update({
      where: { id: video.id },
      data: {
        playableAsset: video.playableAsset
          ? {
              create: {
                id: video.playableAsset.id,
                platform: video.playableAsset.platform,
                isSigned: video.playableAsset.isSigned,
              },
            }
          : undefined,
      },
      include: this.defaultIncludes,
    });

  getVideoById = async (id: string) =>
    this.prisma.video.findUniqueOrThrow({
      where: { id },
      include: this.defaultIncludes,
    });

  getVideosByIds = async (ids: string[]) =>
    this.prisma.video.findMany({
      where: { id: { in: ids } },
      include: this.defaultIncludes,
    });

  getVideoByAssetId = async (assetId: string) =>
    this.prisma.video.findFirstOrThrow({
      where: { editableAsset: { id: assetId } },
      include: this.defaultIncludes,
    });

  maybeGetVideoByAssetId = async (assetId: string) =>
    this.prisma.video.findFirst({
      where: { editableAsset: { id: assetId } },
      include: this.defaultIncludes,
    });
}
