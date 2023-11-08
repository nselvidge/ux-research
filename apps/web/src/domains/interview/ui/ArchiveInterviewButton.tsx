import { IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { useLocation } from "wouter";
import React from "react";
import { FaArchive } from "react-icons/fa";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import {
  ListInterviewsDocument,
  useArchiveInterviewMutation,
  useInterviewQuery,
} from "../requests/interviews.generated";

export const ArchiveInterviewButton = ({
  interviewId,
}: {
  interviewId: string;
}) => {
  const [, navigate] = useLocation();
  const toast = useToast();
  const { currentWorkspace } = useCurrentWorkspace();
  const { data } = useInterviewQuery({
    variables: { id: interviewId },
  });
  const [archiveInterview] = useArchiveInterviewMutation({
    variables: { interviewId },
    refetchQueries: [
      {
        query: ListInterviewsDocument,
        variables: { workspaceId: currentWorkspace },
      },
    ],
  });

  return data?.interview?.currentUserCanEdit ? (
    <Tooltip label="Archive interview">
      <IconButton
        marginLeft="15px"
        variant="link"
        color="brand.500"
        _hover={{ color: "brand.300" }}
        aria-label="remove user"
        icon={<FaArchive size="18px" />}
        margin="10px"
        onClick={async (e) => {
          e.preventDefault();
          await archiveInterview();
          toast({ status: "success", title: "Archived interview" });
          navigate("/");
        }}
      />
    </Tooltip>
  ) : undefined;
};
