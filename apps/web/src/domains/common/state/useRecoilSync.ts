import { useEffect } from "react";
import { RecoilState, useSetRecoilState } from "recoil";

export const useRecoilSync = <T, A extends RecoilState<T>>(
  atom: A,
  data: T
) => {
  const setState = useSetRecoilState(atom);
  useEffect(() => {
    setState(data);
  }, [data]);
};
