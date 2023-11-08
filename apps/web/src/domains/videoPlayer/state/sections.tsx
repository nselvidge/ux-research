import { useMemo } from "react";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { sortBy, prop, reverse, last } from "remeda";
import { currentTimeState } from "./currentTime";
import { usePlayerContext } from "./playerContext";

type VideoSection = {
  start: number;
  end: number;
  label: string;
  id: string;
};

const sectionsState = atom<VideoSection[]>({ key: "sections", default: [] });

const nextSectionState = selector({
  key: "next-section-state",
  get: ({ get }) => {
    const currentTime = get(currentTimeState);
    const sections = get(sectionsState);

    const next = sections?.find((section) => section.start > currentTime);
    if (!next && sections.length > 0) {
      return sections[0];
    }
    return next;
  },
});

const previousSectionState = selector({
  key: "previous-section-state",
  get: ({ get }) => {
    const currentTime = get(currentTimeState);
    const sections = get(sectionsState);

    const previous = [...sections]
      .reverse()
      .find((section) => section.end !== null && section.end - 1 < currentTime);

    if (!previous && sections.length > 0) {
      return last(sections);
    }

    return previous;
  },
});

export const useSections = () => {
  const [sections, setSections] = useRecoilState(sectionsState);
  const { seekTo } = usePlayerContext();

  const nextSection = useRecoilValue(nextSectionState);
  const previousSection = useRecoilValue(previousSectionState);

  return useMemo(
    () => ({
      sections,
      setSections: (newSections: VideoSection[]) => {
        setSections(sortBy(newSections, prop("start")));
      },
      nextSection: () => {
        const newTime = nextSection?.start || 0;

        seekTo(newTime);
      },
      previousSection: () => {
        const newTime = previousSection?.start || last(sections)?.start || 0;

        seekTo(newTime);
      },
    }),
    [sections, nextSection, previousSection]
  );
};

const activeSectionState = selector({
  key: "active-section",
  get: ({ get }) => {
    const sections = get(sectionsState);
    const currentTime = get(currentTimeState);
    const section = reverse(sections).find(
      (section) => section.start <= currentTime
    );
    return section;
  },
});

export const useActiveSection = () => useRecoilValue(activeSectionState);
