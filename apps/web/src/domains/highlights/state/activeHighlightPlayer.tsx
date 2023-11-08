import { atomFamily, useRecoilState } from "recoil";

const activeHighlightPlayerState = atomFamily({
  key: "activeHighlightPlayerState",
  default: { isActive: false, index: 0, highlightCount: 0, playAll: false },
});

export const useActiveHighlightPlayer = (group: string) => {
  const [state, setState] = useRecoilState(activeHighlightPlayerState(group));

  const openPlayer = (index: number) => {
    setState({
      isActive: true,
      index,
      highlightCount: state.highlightCount,
      playAll: false,
    });
  };

  const closePlayer = () => {
    setState({
      isActive: false,
      index: state.index,
      highlightCount: state.highlightCount,
      playAll: false,
    });
  };

  const nextVideo = () => {
    setState({
      isActive: true,
      index: Math.min(state.index + 1, state.highlightCount - 1),
      highlightCount: state.highlightCount,
      playAll: state.playAll,
    });
  };

  const previousVideo = () => {
    setState({
      isActive: true,
      index: Math.max(state.index - 1, 0),
      highlightCount: state.highlightCount,
      playAll: state.playAll,
    });
  };

  const setHighlightCount = (highlightCount: number) => {
    setState({
      isActive: state.isActive,
      index: state.index,
      highlightCount,
      playAll: state.playAll,
    });
  };

  const startPlayAll = () => {
    setState({
      isActive: true,
      index: 0,
      highlightCount: state.highlightCount,
      playAll: true,
    });
  };

  return {
    ...state,
    openPlayer,
    closePlayer,
    nextVideo,
    previousVideo,
    setHighlightCount,
    startPlayAll,
  };
};
