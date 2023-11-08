export type RecordingTargetType = "zoom" | "zoomV2";

export interface RecordingTarget {
  type: RecordingTargetType;
  id: string;
}

export type RecorderType = "recall";
export type RecorderStatus = "pending" | "recording" | "done";

export interface Recorder {
  type: RecorderType;
  id: string;
  error: string | null;
  externalId: string | null;
  target: RecordingTarget;
  status: RecorderStatus;
}

export const createRecorder = ({
  id,
  type,
  externalId,
  target,
  status = "pending",
}: {
  id: string;
  type: RecorderType;
  externalId: string | null;
  target: RecordingTarget;
  status?: RecorderStatus;
}): Recorder => {
  return {
    id,
    type,
    externalId,
    target,
    error: null,
    status,
  };
};

export const addExternalIdToRecorder = (
  recorder: Recorder,
  externalId: string
): Recorder => ({
  ...recorder,
  externalId,
});

export const updateStatusToError = (
  recorder: Recorder,
  error: string
): Recorder => ({
  ...recorder,
  status: "done",
  error,
});

export const updateStatus = (
  recorder: Recorder,
  status: RecorderStatus
): Recorder => ({
  ...recorder,
  status,
});
