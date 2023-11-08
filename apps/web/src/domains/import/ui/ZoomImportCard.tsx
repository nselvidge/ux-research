import React, { useEffect } from "react";
import { IconButton, useToast } from "@chakra-ui/react";
import { FaFileImport } from "react-icons/fa";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import { useImportInterviewFromZoomMutation } from "../requests/zoom.generated";
import { ListInterviewsDocument } from "~/domains/interview/requests/interviews.generated";
import { useLocation } from "wouter";
import { CardContainer } from "~/domains/interview/ui/InterviewCard";
import { trackEvent } from "~/domains/analytics/tracker";

export const ZoomImportCard = ({
  name,
  date,
  externalId,
}: {
  name: string;
  date: number;
  externalId: string;
}) => {
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
      trackEvent("Interview Imported", {
        importType: "zoom",
      });
      return navigate(`/interview/${id}`);
    }
  }, [data?.importInterviewFromZoom?.id, error]);

  return (
    <CardContainer
      title={name}
      date={date}
      cover={
        <IconButton
          aria-label="import recording"
          icon={<FaFileImport size="30px" />}
          variant="ghost"
        />
      }
      onClick={() => importInterview()}
    />
  );
};
