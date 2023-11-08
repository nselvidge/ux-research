import { Flex, IconButton, Text, useToast } from "@chakra-ui/react";
import { format } from "date-fns";
import { FaFileImport } from "react-icons/fa";
import React, { useEffect } from "react";
import { useImportInterviewFromZoomMutation } from "../requests/zoom.generated";
import { useLocation } from "wouter";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import { ListInterviewsDocument } from "~/domains/interview/requests/interviews.generated";

interface ZoomRecordingProps {
  label: string;
  startTime: string;
  externalId: string;
}

export const ZoomRecording = ({
  label,
  startTime,
  externalId,
}: ZoomRecordingProps) => {
  const [_, navigate] = useLocation();
  const { currentWorkspace } = useCurrentWorkspace();
  const toast = useToast();
  const [importInterview, { data, error }] = useImportInterviewFromZoomMutation(
    {
      variables: { externalId, workspaceId: currentWorkspace },
      refetchQueries: [
        {
          query: ListInterviewsDocument,
          variables: { workspaceId: currentWorkspace },
        },
      ],
    }
  );

  useEffect(() => {
    const id = data?.importInterviewFromZoom?.id;
    if (error) {
      toast({
        title: "Recording is not ready yet. Please try again later.",
        status: "error",
      });
      return;
    }
    if (id) {
      return navigate(`/interview/${id}`);
    }
  }, [data?.importInterviewFromZoom?.id, error]);
  return (
    <Flex
      w="100%"
      border="1px solid #E6E6E6"
      p="12px 16px"
      mb="16px"
      alignItems="center"
    >
      <Flex
        bg="#F2F2F2"
        justifyContent="center"
        alignItems="center"
        w="120px"
        h="80px"
        onClick={() => importInterview()}
        cursor="pointer"
      >
        <IconButton
          aria-label="import recording"
          icon={<FaFileImport size="30px" />}
          variant="ghost"
        />
      </Flex>
      <Flex marginLeft="16px" direction="column">
        <Text>{label}</Text>
        <Text fontSize="14px" color="#909090" marginTop="0px">
          {format(new Date(startTime), "PPpp")}
        </Text>
      </Flex>
    </Flex>
  );
};
