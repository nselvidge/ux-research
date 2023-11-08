import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { useMeQuery } from "~/domains/page/requests/page.generated";

const currentWorkspaceState = atom<null | string>({
  key: "current-workspace",
  default: null,
});

export const useCurrentWorkspace = (): {
  currentWorkspace: string | null;
  setCurrentWorkspace: (id: string) => void;
} => {
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState<string | null>(
    currentWorkspaceState
  );
  const { data } = useMeQuery();

  useEffect(() => {
    if (currentWorkspace === null && data?.me?.workspaces.length > 0) {
      setCurrentWorkspace(data?.me?.workspaces[0]?.id);
    }
  }, [data?.me?.workspaces]);

  return { currentWorkspace, setCurrentWorkspace };
};
