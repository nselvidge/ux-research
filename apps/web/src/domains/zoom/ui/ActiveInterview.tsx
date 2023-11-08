import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { FaStop } from "react-icons/fa";
import { find, map, pipe, sortBy } from "remeda";
import { FullPageSpinner } from "~/domains/common/ui/FullPageSpinner";
import { SelectInput } from "~/domains/common/ui/SelectInput";
import {
  GetPendingInterviewByRecordingTargetDocument,
  GetPendingInterviewDocument,
  useRemoveInterviewFromProjectMutation,
  useStopRecordingMutation,
} from "~/domains/conduct/requests/conduct.generated";
import { AddHighlightButton } from "~/domains/conduct/ui/AddHighlightButton";
import { TaggedHighlightButtonList } from "~/domains/conduct/ui/TaggedHighlightButtonList";
import { useMoveInterviewsToProjectMutation } from "~/domains/projects/requests/projects.generated";
import { TagColor } from "~/global/generated/graphql";

type TagType = {
  id: string;
  name: string;
  color: TagColor;
  isDefault: boolean;
  emoji: string;
};

export interface ActiveInterviewProps {
  meetingId?: string;
  pendingInterview: {
    id: string;
    projectId?: string;
    pendingHighlights: {
      id: string;
      timestamp: number;
      tags?: TagType[];
    }[];
    workspace: {
      id: string;
      tags?: TagType[];
      projects?: {
        id: string;
        name: string;
        projectTags: {
          position: number;
          tag: TagType;
        }[];
      }[];
    };
  };
}

const HighlightExplainer = () => (
  <Text flexShrink={0} variant="caption" paddingTop="8px" textAlign="center">
    “Cmd + S” automatically saves a highlight for the last 15 seconds and the
    next 15 seconds. You can also tag & organize them later.
  </Text>
);

export const HighlightPrompt = ({ count }: { count?: number }) => (
  <Flex
    direction="column"
    alignItems="center"
    background="white"
    border="1px solid #E9DCC9"
    borderRadius="16px"
    flexGrow={1}
    width="100%"
    marginBottom="16px"
    justifyContent="center"
  >
    <Flex justifyContent="space-around" alignItems="center" width="80%">
      <Text fontSize="48px" as="span" transform="rotate(-23deg)">
        ✨
      </Text>
      <Text fontSize="64px" as="span" transform="rotate(7deg)">
        👇
      </Text>
      <Text fontSize="32px" as="span" transform="rotate(23deg)">
        🎥
      </Text>
    </Flex>
    {count > 0 ? (
      <>
        <Heading variant="titleBold" fontSize="84px" marginBottom="8px">
          {count}
        </Heading>{" "}
        <Heading textAlign="center" variant="titleBold">
          Highlights saved
        </Heading>{" "}
      </>
    ) : (
      <Heading textAlign="center" variant="titleBold">
        "Cmd+S" to save a highlight
      </Heading>
    )}
    <Flex justifyContent="space-around" alignItems="center" width="80%">
      <Text fontSize="48px" as="span" transform="rotate(23deg)">
        🎙
      </Text>
      <Text fontSize="64px" as="span" transform="rotate(-7deg)">
        👆
      </Text>
      <Text fontSize="32px" as="span" transform="rotate(-23deg)">
        🤩
      </Text>
    </Flex>
  </Flex>
);

export const ActiveInterview = ({
  pendingInterview,
  meetingId,
}: ActiveInterviewProps) => {
  const projectOptions = pendingInterview.workspace.projects
    ?.map((project) => ({
      label: project.name,
      value: project.id,
    }))
    ?.concat({
      label: "No Project",
      value: null,
    });

  const projectTags = pendingInterview.projectId
    ? pipe(
        pendingInterview.workspace.projects,
        find((project) => project.id === pendingInterview.projectId),
        (project) => project?.projectTags,
        sortBy((projectTag) => projectTag.position),
        map((projectTag) => projectTag.tag)
      )
    : [];

  const otherTags = pendingInterview.projectId
    ? pendingInterview.workspace.tags?.filter((tag) => {
        return !projectTags.find((projectTag) => projectTag.id === tag.id);
      })
    : pendingInterview.workspace.tags;

  const [moveInterviewToProject, { loading }] =
    useMoveInterviewsToProjectMutation();

  const [removeInterviewFromProject, { loading: loadingRemoveInterview }] =
    useRemoveInterviewFromProjectMutation();

  const [stopRecording, { loading: loadingStopRecording }] =
    useStopRecordingMutation({
      variables: {
        meetingId,
      },
      refetchQueries: [
        {
          query: GetPendingInterviewDocument,
          variables: { externalId: meetingId },
        },
        {
          query: GetPendingInterviewByRecordingTargetDocument,
          variables: { externalId: meetingId },
        },
      ],
    });

  if (loading || loadingRemoveInterview) {
    return <FullPageSpinner />;
  }

  return (
    <Flex
      direction="column"
      alignItems="center"
      height="100%"
      overflow="hidden"
      width="100%"
    >
      {pendingInterview?.workspace?.tags?.length > 0 ? (
        <>
          {projectOptions && projectOptions.length > 1 && (
            <Flex
              direction="column"
              width="100%"
              alignItems="start"
              marginBottom="16px"
            >
              <Text variant="caption" marginBottom="8px">
                Project
              </Text>
              <SelectInput
                width="100%"
                variant="brandMono"
                options={projectOptions}
                value={pendingInterview.projectId}
                onChange={(projectId) => {
                  if (projectId === null) {
                    return removeInterviewFromProject({
                      variables: {
                        interviewId: pendingInterview.id,
                      },
                    });
                  }

                  return moveInterviewToProject({
                    variables: {
                      projectId,
                      interviewIds: [pendingInterview.id],
                    },
                  });
                }}
              />
            </Flex>
          )}
          <TaggedHighlightButtonList
            highlights={pendingInterview.pendingHighlights}
            tags={otherTags}
            interviewId={pendingInterview.id}
            projectTags={projectTags}
          />
        </>
      ) : (
        <>
          <HighlightPrompt count={pendingInterview.pendingHighlights.length} />
          <AddHighlightButton interviewId={pendingInterview.id} />
        </>
      )}
      {meetingId && (
        <Button
          leftIcon={<FaStop />}
          variant="brandInverted"
          width="100%"
          margin="8px"
          isLoading={loadingStopRecording}
          onClick={() => {
            stopRecording();
          }}
        >
          Stop Recording
        </Button>
      )}
      <HighlightExplainer />
    </Flex>
  );
};
