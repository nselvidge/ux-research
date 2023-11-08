import { Flex, Spacer } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { DeleteTagButton } from "~/domains/tags/ui/DeleteTagButton";
import { EditTagButton } from "~/domains/tags/ui/EditTagButton";
import { HighlightTag } from "~/domains/tags/ui/HighlightTag";
import {
  useTagHighlightCountsQuery,
  useWorkspaceQuery,
} from "../requests/workspace.generated";

export const TagManagementList = ({ workspaceId }: { workspaceId: string }) => {
  const { data: workspaceData } = useWorkspaceQuery({
    variables: { id: workspaceId },
  });
  const { data: tagHighlightCountsData } = useTagHighlightCountsQuery({
    variables: { workspaceId },
  });

  const countMap = useMemo(
    () =>
      tagHighlightCountsData?.getTagHighlightCounts?.reduce(
        (acc, { tagId, highlightCount }) => ({
          ...acc,
          [tagId]: highlightCount,
        }),
        {} as Record<string, number>
      ) || {},
    [tagHighlightCountsData]
  );

  return (
    <Flex direction="column" alignItems="stretch" width="100%">
      {workspaceData?.workspace?.tags?.map(
        ({ id, name, color, isDefault, emoji }) => (
          <Flex key={id} padding="4px 0px">
            <HighlightTag
              id={id}
              emoji={emoji}
              name={name}
              highlightCount={countMap[id]}
              color={color}
            />
            <Spacer />
            {!isDefault && (
              <>
                <EditTagButton
                  id={id}
                  name={name}
                  color={color}
                  emoji={emoji}
                />
                <DeleteTagButton tagId={id} />
              </>
            )}
          </Flex>
        )
      )}
    </Flex>
  );
};
