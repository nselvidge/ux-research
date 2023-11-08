import { useMemo } from "react";
import { useInterviewWorkspaceQuery } from "../requests/highlights.generated";

export const useInterviewTags = (interviewId: string) => {
  const { data } = useInterviewWorkspaceQuery({
    variables: { id: interviewId },
  });

  const tags = data?.interview?.workspace?.tags;

  return tags;
};
