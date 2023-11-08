import {
  isEditableAsset,
  isProcessingAsset,
  Video,
} from "../../entities/Video";
import {
  deserializeRecorder,
  PersistenceRecorder,
  serializeRecorder,
} from "./SerializedRecorder";

export interface SerializedEditableAsset {
  id: string;
  status: "completed" | "processing";
  playbackId: string | null;
  isSigned: boolean;
}

export interface SerializedPlayableAsset {
  id: string;
  platform: "mux" | "s3" | "local";
  isSigned: boolean;
}

export interface PersistenceVideo {
  id: string;
  startTime: Date;
  editableAsset: SerializedEditableAsset | null;
  playableAsset: SerializedPlayableAsset | null;
  recorder: PersistenceRecorder | null;
}

export interface GatewayVideo {
  id: string;
  startTime: Date;
  editableAsset: SerializedEditableAsset | null;
  playableAsset: SerializedPlayableAsset | null;
  recorder: PersistenceRecorder | null;
}

export const serializeVideo = (video: Video): PersistenceVideo => {
  return {
    id: video.id,
    startTime: video.startTime,
    editableAsset: video.editableAsset,
    playableAsset: video.playableAsset,
    recorder: video.recorder ? serializeRecorder(video.recorder) : null,
  };
};

export const deserializeVideo = (video: PersistenceVideo): Video => {
  const asset = video.editableAsset;
  if (asset !== null && !isProcessingAsset(asset) && !isEditableAsset(asset)) {
    throw new Error("invalid asset");
  }

  return {
    ...video,
    editableAsset: asset,
    recorder: video.recorder ? deserializeRecorder(video.recorder) : null,
  };
};
