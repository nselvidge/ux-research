import React, { useCallback, useEffect, useMemo } from "react";
import {
  filter,
  first,
  last,
  map,
  pipe,
  reduce,
  reverse,
  sortBy,
} from "remeda";
import { usePlayerContext } from "~/domains/videoPlayer/state/playerContext";
import { useSections } from "~/domains/videoPlayer/state/sections";
import {
  useInterviewHighlightsQuery,
  useUpdateHighlightMutation,
} from "../../requests/interviews.generated";
import { TranscriptGroupData } from "../../state/parsedTranscript";
import { Highlight, HighlightType } from "../../../highlights/ui/Highlight";
import { useCurrentEditingHighlight } from "~/domains/highlights/state/editHighlight";
import { HoverPrompt } from "~/domains/highlights/ui/HoverPrompt";
import { useNewHighlight } from "~/domains/highlights/state/newHighlight";
import { trackEvent } from "~/domains/analytics/tracker";
import { EditHighlightPrompt } from "~/domains/highlights/ui/EditHighlightPrompt";
import { HighlightDetailPrompt } from "~/domains/highlights/ui/HighlightDetailPrompt";
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

export const Highlights = ({
  groups,
  interviewId,
  disableEdits,
  activeTagIds,
  onlySuggestedHighlights,
}: {
  groups: TranscriptGroupData[];
  interviewId: string;
  activeTagIds?: string[];
  disableEdits?: boolean;
  onlySuggestedHighlights?: boolean;
}) => {
  const {
    transcriptMode: { disableScroll },
    removeTag,
  } = useTranscriptMode();

  const { data, startPolling, stopPolling, loading } =
    useInterviewHighlightsQuery({
      variables: { id: interviewId },
    });

  const {
    setCurrentHighlight,
    unsetCurrentHighlight,
    selectionId,
    currentHighlightId,
    isActivelyEditing,
  } = useCurrentEditingHighlight();

  const currentHighlight = useMemo(
    () =>
      data?.interview?.highlights.find(({ id }) => id === currentHighlightId) ||
      null,
    [data?.interview?.highlights, selectionId]
  );

  const { newHighlight } = useNewHighlight();

  useEffect(() => {
    if (!data?.interview || data.interview.highlights.length === 0) {
      return startPolling(10000);
    }
    stopPolling();
  }, [data]);

  const highlights = useMemo(
    () =>
      pipe(
        data?.interview?.highlights || [],
        filter(({ tags }) =>
          activeTagIds?.length > 0
            ? activeTagIds.some(
                (activeId) => !!tags.find((tag) => tag.id === activeId)
              )
            : true
        ),
        filter(({ originSuggestionId }) =>
          onlySuggestedHighlights ? originSuggestionId !== null : true
        ),
        sortBy((highlight) => highlight.highlightedRange.startWord.start)
      ),
    [data?.interview?.highlights, activeTagIds]
  );

  const { setSections } = useSections();
  const { duration } = usePlayerContext();

  useEffect(() => {
    if (highlights?.length > 0) {
      pipe(
        highlights,
        map(convertHighlightToSection),
        correctTimestamps(duration),
        setSections
      );
    }
    return () => {
      setSections([]);
    };
  }, [highlights]);

  useEffect(() => {
    // If a tag is active but there are no matching highlights, remove the tag
    for (const activeTagId of activeTagIds) {
      if (
        !highlights.find(
          (highlight) => !!highlight.tags.find((t) => t.id === activeTagId)
        )
      ) {
        removeTag(activeTagId);
      }
    }
  }, [highlights, activeTagIds]);

  const [baseUpdateHighlight] = useUpdateHighlightMutation();

  const updateHighlight = useCallback(
    (
      highlight: HighlightType & {
        id: string;
        highlightedRange: { text: string };
      },
      startWord: {
        id: string;
        wordNumber: number;
        groupNumber: number;
        start: number;
        end: number;
      },
      endWord: {
        id: string;
        wordNumber: number;
        groupNumber: number;
        start: number;
        end: number;
      }
    ) => {
      if (
        highlight.highlightedRange.startWord.start === startWord.start &&
        highlight.highlightedRange.endWord.start === endWord.start
      ) {
        trackEvent("No-op highlight update", { highlightId: highlight.id });
        return;
      }
      trackEvent("Highlight updated", {
        highlightId: highlight.id,
        interviewId,
      });
      return baseUpdateHighlight({
        variables: {
          interviewId,
          highlightId: highlight.id,
          startTime: startWord.start,
          endTime: endWord.end,
        },
        context: { debounceKey: "updateHighlight" },
        optimisticResponse: {
          updateHighlight: {
            __typename: "Highlight",
            id: highlight.id,
            highlightedRange: {
              ...highlight.highlightedRange,
              startWord: {
                ...startWord,
              },
              endWord: {
                ...endWord,
              },
            },
          },
        },
      });
    },
    [interviewId]
  );

  if (loading) {
    return null;
  }

  return (
    <>
      {highlights.map((highlight, i) => (
        <Highlight
          key={highlight.id}
          highlight={highlight}
          groups={groups}
          disableEdits={!data?.interview?.currentUserCanEdit || disableEdits}
          background={
            highlight.tags.length === 0
              ? "#A1A1A1"
              : `${first(highlight.tags).color}.500`
          }
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
          updateHighlight={updateHighlight}
          positionDeps={[activeTagIds]}
          scrollIntoView={!disableScroll && i === 0 && activeTagIds?.length > 0}
        />
      ))}

      <HoverPrompt
        interviewId={interviewId}
        groups={groups}
        currentHighlight={currentHighlight}
      >
        {isActivelyEditing || newHighlight ? (
          <EditHighlightPrompt
            currentHighlight={currentHighlight || newHighlight}
            interviewId={interviewId}
          />
        ) : (
          <HighlightDetailPrompt
            interviewId={interviewId}
            currentHighlight={currentHighlight}
          />
        )}
      </HoverPrompt>
    </>
  );
};
