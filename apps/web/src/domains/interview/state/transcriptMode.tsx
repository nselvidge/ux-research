import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

export type TranscriptMode = "full" | "tags" | "suggested";

type TranscriptModeState = {
  mode: TranscriptMode;
  tagIds: string[];
  disableScroll?: boolean;
};

const transcriptModeState = atom<TranscriptModeState>({
  key: "transcriptMode",
  default: {
    mode: "full",
    tagIds: [],
    disableScroll: false,
  },
});

export const useTranscriptMode = () => {
  const [transcriptMode, setTranscriptMode] =
    useRecoilState(transcriptModeState);

  const setMode = useCallback(
    (mode: "full" | "suggested") => setTranscriptMode({ mode, tagIds: [] }),
    [setTranscriptMode]
  );

  const addTag = useCallback(
    (tagId: string, disableScroll?: boolean) =>
      setTranscriptMode((state) => ({
        mode: "tags",
        tagIds: state.tagIds.concat(tagId),
        disableScroll,
      })),
    [setTranscriptMode]
  );

  const removeTag = useCallback(
    (tagId: string) =>
      setTranscriptMode((state) => {
        const newTagIds = state.tagIds.filter((id) => id !== tagId);
        return {
          mode: newTagIds.length === 0 ? "full" : "tags",
          tagIds: newTagIds,
        };
      }),
    [setTranscriptMode]
  );

  return { transcriptMode, addTag, setMode, removeTag };
};
