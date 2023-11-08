import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { IconButton, useToast } from "@chakra-ui/react";
import React from "react";
import { FaArchive, FaEllipsisV, FaFolderMinus } from "react-icons/fa";
import { useLocation } from "wouter";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import {
  InterviewDocument,
  ListInterviewsDocument,
  useArchiveInterviewMutation,
  useInterviewQuery,
} from "../requests/interviews.generated";
import { ProjectDocument } from "~/domains/projects/requests/projects.generated";
import { InternalRefetchQueriesInclude } from "@apollo/client";
import { useRemoveInterviewFromProjectMutation } from "~/domains/conduct/requests/conduct.generated";

export const InterviewOptionsMenu = ({
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

  const refetchQueries: InternalRefetchQueriesInclude = [
    {
      query: ListInterviewsDocument,
      variables: { workspaceId: currentWorkspace },
    },
    {
      query: InterviewDocument,
      variables: { id: interviewId },
    },
  ];

  if (data?.interview?.projectId) {
    refetchQueries.push({
      query: ProjectDocument,
      variables: { projectId: data?.interview?.projectId },
    });
  }

  const [archiveInterview] = useArchiveInterviewMutation({
    variables: { interviewId },
    refetchQueries,
  });

  const [removeInterviewFromProject] = useRemoveInterviewFromProjectMutation({
    variables: { interviewId },
    refetchQueries,
  });

  return data?.interview?.currentUserCanEdit ? (
    <Menu>
      <MenuButton
        marginLeft="4px"
        as={IconButton}
        icon={<FaEllipsisV />}
        variant="brand"
        borderRadius="8px"
      />
      <MenuList>
        <MenuItem
          icon={<FaArchive />}
          onClick={async (e) => {
            e.preventDefault();
            await archiveInterview();
            toast({ status: "success", title: "Archived interview" });
            navigate(
              data?.interview?.projectId
                ? `/project/${data?.interview?.projectId}`
                : "/"
            );
          }}
        >
          Archive Interview
        </MenuItem>
        {data?.interview?.projectId && (
          <MenuItem
            icon={<FaFolderMinus />}
            onClick={async (e) => {
              e.preventDefault();
              await removeInterviewFromProject();
              toast({
                status: "success",
                title: "Interview removed from project",
              });
            }}
          >
            Remove from Project
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  ) : undefined;
};
