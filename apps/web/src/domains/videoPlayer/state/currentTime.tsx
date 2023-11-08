import {
  atom,
  RecoilState,
  selector,
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
} from "recoil";

type Milliseconds = number;
type Seconds = number;

export const currentTimeState = atom<Milliseconds>({
  key: "currentTime",
  default: 0,
});

export const useCurrentTime = () => useRecoilState(currentTimeState);

const currentTimeSecondsState = selector({
  key: "currentTimeSeconds",
  get: ({ get }) => {
    const currentTime = get(currentTimeState);
    return Math.floor(currentTime / 1000);
  },
});

export const useCurrentTimeSeconds = () =>
  useRecoilValue(currentTimeSecondsState);
