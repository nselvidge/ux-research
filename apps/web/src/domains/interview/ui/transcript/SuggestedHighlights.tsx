import React, { useEffect, useMemo } from "react";
import { last, map, pipe, reduce, reverse, sortBy } from "remeda";
import { usePlayerContext } from "~/domains/videoPlayer/state/playerContext";
import { useSections } from "~/domains/videoPlayer/state/sections";
import { useInterviewHighlightsQuery } from "../../requests/interviews.generated";
import { TranscriptGroupData } from "../../state/parsedTranscript";
import { Highlight } from "../../../highlights/ui/Highlight";
import { useCurrentEditingHighlight } from "~/domains/highlights/state/editHighlight";
import { HoverPrompt } from "~/domains/highlights/ui/HoverPrompt";
import { useNewHighlight } from "~/domains/highlights/state/newHighlight";
import { SuggestedHighlightPrompt } from "~/domains/highlights/ui/SuggestedHighlightPrompt";
import { useTranscriptMode } from "../../state/transcriptMode";

const convertHighlightToSection = ({
  id,
  highlightedRange: {
    text,
    startWord: { start },
    endWord: { end },
  },
}: {
  id: string;
  highlightedRange: {
    text: string;
    startWord: { start: number };
    endWord: { end: number };
  };
}) => ({
  start: start,
  end: end,
  label: text,
  id,
});

interface Section {
  start: number;
  end: number;
  label: string;
}

const correctTimestamps =
  (duration: number) =>
  (sections: Section[]): Section[] =>
    pipe(
      sortBy(sections, [({ start }) => start, "desc"]),
      reduce((acc: Section[], next: Section): Section[] => {
        const lastItem = last(acc);
        if (!lastItem) {
          return [{ ...next, end: duration }];
        }
        return [...acc, { ...next, end: lastItem.start }];
      }, [] as Section[]),
      reverse()
    );

export const SuggestedHighlights = ({
  groups,
  interviewId,
}: {
  groups: TranscriptGroupData[];
  interviewId: string;
}) => {
  const { data, loading } = useInterviewHighlightsQuery({
    variables: { id: interviewId },
  });

  const {
    setCurrentHighlight,
    unsetCurrentHighlight,
    selectionId,
    currentHighlightId,
  } = useCurrentEditingHighlight();

  const currentHighlight = useMemo(
    () =>
      data?.interview?.suggestedHighlights.find(
        ({ id }) => id === currentHighlightId
      ) || null,
    [data?.interview?.suggestedHighlights, selectionId]
  );

  const { newHighlight } = useNewHighlight();

  const suggestedHighlights = useMemo(
    () =>
      sortBy(
        data?.interview?.suggestedHighlights || [],
        (highlight) => highlight.highlightedRange.startWord.start
      ),
    [data?.interview?.suggestedHighlights]
  );

  const { setSections } = useSections();
  const { duration } = usePlayerContext();
  const { setMode } = useTranscriptMode();

  useEffect(() => {
    if (suggestedHighlights?.length > 0) {
      pipe(
        suggestedHighlights,
        map(convertHighlightToSection),
        correctTimestamps(duration),
        setSections
      );
    } else {
      setMode("full");
    }
    return () => {
      setSections([]);
    };
  }, [suggestedHighlights]);

  if (loading) {
    return null;
  }

  return (
    <>
      {suggestedHighlights.map((highlight, i) => (
        <Highlight
          key={highlight.id}
          highlight={highlight}
          groups={groups}
          disableEdits
          background={`yellow.500`}
          onMouseEnter={() => {
            if (newHighlight) {
              return;
            }
            setCurrentHighlight(highlight.id);
          }}
          onMouseLeave={() => {
            window.setTimeout(() => unsetCurrentHighlight(selectionId), 1500);
          }}
          isHovered={currentHighlight?.id === highlight.id}
          updateHighlight={() => Promise.reject("Not implemented")}
          positionDeps={[]}
          scrollIntoView={i === 0}
        />
      ))}

      <HoverPrompt
        interviewId={interviewId}
        groups={groups}
        currentHighlight={currentHighlight}
      >
        <SuggestedHighlightPrompt
          currentHighlight={currentHighlight}
          interviewId={interviewId}
        />
      </HoverPrompt>
    </>
  );
};
