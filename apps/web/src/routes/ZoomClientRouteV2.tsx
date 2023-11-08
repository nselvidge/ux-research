import { CircularProgress, Flex } from "@chakra-ui/react";
import { captureException } from "@sentry/react";
import React, { useEffect, useState } from "react";
import { GenericErrorMessage } from "~/domains/common/ui/GenericErrorMessage";
import {
  GetPendingInterviewDocument,
  useGetPendingInterviewByRecordingTargetQuery,
  useRecordInterviewMutation,
} from "~/domains/conduct/requests/conduct.generated";
import { useWorkspaceProjectsQuery } from "~/domains/projects/requests/projects.generated";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import { useCloudRecording } from "~/domains/zoom/requests/zoom";
import { ActiveInterview } from "~/domains/zoom/ui/ActiveInterview";
import { InterviewComplete } from "~/domains/zoom/ui/InterviewComplete";
import { NoBotsAvailable } from "~/domains/zoom/ui/NoBotsAvailable";
import { NotRecording } from "~/domains/zoom/ui/NotStartedRecording";
import { StartMeeting } from "~/domains/zoom/ui/StartMeeting";
import { UserNotHost } from "~/domains/zoom/ui/UserNotHost";

export const ZoomClientRouteV2 = () => {
  const [isStartingRecording, setIsStartingRecording] = useState(false);

  const { meetingId, loading, userRole, localRecording } =
    useCloudRecording(true);

  const { currentWorkspace } = useCurrentWorkspace();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const { data: workspaceData } = useWorkspaceProjectsQuery({
    variables: { workspaceId: currentWorkspace },
    skip: !currentWorkspace,
  });

  const projectOptions =
    workspaceData?.workspace?.projects
      ?.map((project) => ({
        label: project.name,
        value: project.id,
      }))
      ?.concat({
        label: "No Project",
        value: null,
      }) || [];

  const [
    recordInterview,
    { loading: loadingCreateInterview, error: recordInterviewError },
  ] = useRecordInterviewMutation({
    variables: {
      externalId: meetingId,
      workspaceId: currentWorkspace,
      projectId: selectedProjectId,
    },
    refetchQueries: [
      {
        query: GetPendingInterviewDocument,
        variables: { externalId: meetingId },
      },
    ],
  });

  const {
    data: pendingInterview,
    loading: loadingInterview,
    error: pendingInterviewError,
  } = useGetPendingInterviewByRecordingTargetQuery({
    variables: { externalId: meetingId },
    skip: !meetingId,
    pollInterval: 3000,
  });

  useEffect(() => {
    if (pendingInterviewError) {
      captureException(pendingInterviewError);
    }
    if (recordInterviewError) {
      captureException(recordInterviewError);
    }
  }, [pendingInterviewError, recordInterviewError]);

  useEffect(() => {
    // recall sometimes doesn't have enough bots available, so
    // we need to retry
    if (
      recordInterviewError &&
      recordInterviewError.message.includes("Insufficient Storage")
    ) {
      const timeout = setTimeout(recordInterview, 5000);
      return () => clearTimeout(timeout);
    }
  }, [recordInterviewError]);

  if (pendingInterviewError) {
    return <GenericErrorMessage errorData={pendingInterviewError} />;
  }

  if (
    (recordInterviewError?.graphQLErrors?.[0]?.extensions?.exception as any)
      ?.code === "UnableToCreateBot"
  ) {
    return <NoBotsAvailable retryRecording={recordInterview} />;
  }

  if (pendingInterview?.recordingStatus === "pending") {
    return <NoBotsAvailable retryRecording={() => {}} />;
  }

  if (recordInterviewError) {
    return <GenericErrorMessage errorData={recordInterviewError} />;
  }

  if (loading || loadingInterview) {
    return (
      <Flex
        direction="column"
        alignItems="center"
        padding="25px"
        height="100%"
        backgroundColor="cream.300"
        justifyContent="center"
      >
        <CircularProgress color="brand.500" isIndeterminate />
      </Flex>
    );
  }

  if (!meetingId) {
    return (
      <Flex
        direction="column"
        alignItems="center"
        padding="25px"
        height="100%"
        background="cream.300"
      >
        <StartMeeting />
      </Flex>
    );
  }

  if (userRole && !["host", "coHost"].includes(userRole)) {
    return (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        padding="25px"
        height="100%"
        backgroundColor="cream.300"
      >
        <UserNotHost />
      </Flex>
    );
  }

  console.log(pendingInterview?.recordingStatus);
  return (
    <Flex
      direction="column"
      alignItems="center"
      padding="16px"
      height="100%"
      backgroundColor="cream.300"
    >
      {pendingInterview?.recordingStatus === "done" ? (
        <InterviewComplete version="V2" />
      ) : !!pendingInterview?.getPendingInterviewByRecordingTarget ? (
        <ActiveInterview
          meetingId={meetingId}
          pendingInterview={
            pendingInterview.getPendingInterviewByRecordingTarget
          }
        />
      ) : (
        <NotRecording
          loading={
            loading ||
            loadingCreateInterview ||
            isStartingRecording ||
            loadingInterview
          }
          localRecording={localRecording}
          projectOptions={projectOptions}
          currentProjectId={selectedProjectId}
          onProjectChange={setSelectedProjectId}
          startInterview={recordInterview}
        />
      )}
    </Flex>
  );
};
