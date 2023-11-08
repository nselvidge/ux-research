import { atom, useRecoilState } from "recoil";

const isTrackingState = atom({
  key: "isTracking",
  default: true,
});

export const useIsTracking = () => {
  const [isTracking, setIsTracking] = useRecoilState(isTrackingState);

  return {
    isTracking,
    setIsTracking,
  };
};
