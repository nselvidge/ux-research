import { useMemo } from "react";
import { selectorFamily, useRecoilValue } from "recoil";
import { filter, find, flatMap, pipe, prop } from "remeda";
import {
  currentTimeState,
  useCurrentTime,
} from "~/domains/videoPlayer/state/currentTime";
import { valueIsBetweenBounds } from "../utils/valueIsBetweenBounds";
import { TranscriptGroupData } from "./parsedTranscript";

type Milliseconds = number;

export const isActiveSelector = selectorFamily({
  key: `is-active-word`,
  get:
    ({ start, end }: { start: Milliseconds; end: Milliseconds }) =>
    ({ get }) => {
      return valueIsBetweenBounds(get(currentTimeState), start, end);
    },
});

export const useIsActive = (value: {
  start: Milliseconds;
  end: Milliseconds;
}) => {
  const val = useRecoilValue(isActiveSelector(value));
  return val;
};

export const useActiveWord = (groups: TranscriptGroupData[]) => {
  const [currentTime] = useCurrentTime();
  return useMemo(
    () =>
      groups
        ? pipe(
            groups,
            filter(({ start, end }) =>
              valueIsBetweenBounds(currentTime, start, end)
            ),
            flatMap(prop("words")),
            find(({ start, end }) =>
              valueIsBetweenBounds(currentTime, start, end)
            )
          )
        : undefined,
    [groups, currentTime]
  );
};
