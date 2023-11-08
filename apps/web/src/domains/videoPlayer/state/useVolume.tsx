import { useMemo } from "react";
import { atom, AtomEffect, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export interface VolumeState {
  volume: number;
  isMute: boolean;
}
const volumeState = atom<VolumeState>({
  key: "volume",
  default: {
    volume: 1,
    isMute: false,
  },
  effects: [persistAtom],
});

export const useVolume = () => {
  const [{ volume, isMute }, setVolumeState] = useRecoilState(volumeState);

  return useMemo(
    () => ({
      volume,
      isMute,
      setVolume: (volume: number) =>
        setVolumeState(
          (state: VolumeState): VolumeState => ({ ...state, volume })
        ),
      toggleMute: () =>
        setVolumeState(
          (state: VolumeState): VolumeState => ({
            ...state,
            isMute: !state.isMute,
          })
        ),
    }),
    [volume, isMute]
  );
};
