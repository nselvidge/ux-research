import { randomUUID } from "crypto";
import { Recorder } from "./Recorder";

export interface PlayableAsset {
  id: string;
  platform: "mux" | "s3" | "local";
  isSigned: boolean;
}

export type ProcessingStatus = "pending" | "processing" | "completed";

interface ProcessingAsset {
  id: string;
  status: "processing";
  playbackId: null;
  isSigned: boolean;
}

interface EditableAsset {
  id: string;
  status: "completed";
  playbackId: string | null;
  isSigned: boolean;
}

export const isProcessingAsset = (asset: any): asset is ProcessingAsset =>
  asset.status === "processing" && asset.playbackId === null;

export const isEditableAsset = (asset: any): asset is EditableAsset =>
  asset.status === "completed" && asset.playbackId !== null;

type Milliseconds = number;

export interface Video {
  id: string;
  startTime: Date;
  editableAsset: null | ProcessingAsset | EditableAsset;
  playableAsset: null | PlayableAsset;
  recorder: null | Recorder;
}

export const createVideo = ({
  startTime,
  id = randomUUID(),
  editableAsset = null,
  playableAsset = null,
  recorder = null,
}: {
  id?: string;
  startTime: Date;
  editableAsset?: null | ProcessingAsset | EditableAsset;
  playableAsset?: null | PlayableAsset;
  recorder?: null | Recorder;
}) => ({
  id,
  startTime,
  editableAsset,
  playableAsset,
  recorder,
});

export const updateVideoEditableAsset = (
  video: Video,
  asset: ProcessingAsset | EditableAsset
) => {
  return { ...video, editableAsset: asset };
};

export const updateVideoPlayableAsset = (
  video: Video,
  asset: PlayableAsset
) => {
  return { ...video, playableAsset: asset };
};

export const createVideoClip = (
  video: Video,
  startTime: Milliseconds,
  endTime: Milliseconds
) => {
  if (!isEditableAsset(video.editableAsset)) {
    throw new Error("Video must have an editable asset");
  }

  return {
    clip: {
      id: randomUUID(),
      startTime: new Date(video.startTime.getTime() + startTime),
      editableAsset: null,
      playableAsset: null,
      recorder: null,
    },
    editableAssetId: video.editableAsset.id,
  };
};
