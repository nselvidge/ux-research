import { CircularProgress, Flex } from "@chakra-ui/react";
import { captureException } from "@sentry/react";
import React, { useEffect, useState } from "react";
import { GenericErrorMessage } from "~/domains/common/ui/GenericErrorMessage";
import {
  GetPendingInterviewDocument,
  useCreatePendingInterviewMutation,
  useGetPendingInterviewQuery,
} from "~/domains/conduct/requests/conduct.generated";
import { useWorkspaceProjectsQuery } from "~/domains/projects/requests/projects.generated";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import { useCloudRecording } from "~/domains/zoom/requests/zoom";
import { ActiveInterview } from "~/domains/zoom/ui/ActiveInterview";
import { InterviewComplete } from "~/domains/zoom/ui/InterviewComplete";
import { NotRecording } from "~/domains/zoom/ui/NotStartedRecording";
import { RecordingWithoutInterview } from "~/domains/zoom/ui/RecordingWithoutInterview";
import { StartMeeting } from "~/domains/zoom/ui/StartMeeting";
import { UserNotHost } from "~/domains/zoom/ui/UserNotHost";

export const ZoomClientRoute = () => {
  const [isStartingRecording, setIsStartingRecording] = useState(false);

  const {
    isRecording,
    meetingId,
    loading,
    startRecording,
    userRole,
    localRecording,
  } = useCloudRecording(false);

  const { currentWorkspace } = useCurrentWorkspace();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const { data: workspaceData } = useWorkspaceProjectsQuery({
    variables: { workspaceId: currentWorkspace },
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
    createPendingInterview,
    { loading: loadingCreateInterview, error: createPendingInterviewError },
  ] = useCreatePendingInterviewMutation({
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
  } = useGetPendingInterviewQuery({
    variables: { externalId: meetingId },
    skip: !meetingId,
  });

  useEffect(() => {
    if (pendingInterviewError) {
      captureException(pendingInterviewError);
    }
    if (createPendingInterviewError) {
      captureException(createPendingInterviewError);
    }
  }, [pendingInterviewError, createPendingInterviewError]);

  if (pendingInterviewError) {
    return <GenericErrorMessage errorData={pendingInterviewError} />;
  }

  if (createPendingInterviewError) {
    return <GenericErrorMessage errorData={createPendingInterviewError} />;
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

  return (
    <Flex
      direction="column"
      alignItems="center"
      padding="16px"
      height="100%"
      backgroundColor="cream.300"
    >
      {isRecording && !!pendingInterview?.getPendingInterview ? (
        <ActiveInterview
          pendingInterview={pendingInterview.getPendingInterview}
        />
      ) : isRecording &&
        !loadingCreateInterview &&
        !isStartingRecording &&
        !isStartingRecording ? (
        <RecordingWithoutInterview />
      ) : !!pendingInterview?.getPendingInterview && !isStartingRecording ? (
        <InterviewComplete version="" />
      ) : (
        <NotRecording
          loading={loading || loadingCreateInterview || isStartingRecording}
          localRecording={localRecording}
          projectOptions={projectOptions}
          currentProjectId={selectedProjectId}
          onProjectChange={setSelectedProjectId}
          startInterview={async () => {
            setIsStartingRecording(true);
            try {
              const isSuccess = await startRecording();
              if (!isSuccess) {
                return;
              }
              await createPendingInterview();
            } catch (err) {
              captureException(err);
            }
            setIsStartingRecording(false);
          }}
        />
      )}
    </Flex>
  );
};
