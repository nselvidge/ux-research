import { Checkbox, FormControl, FormHelperText } from "@chakra-ui/react";
import React from "react";
import {
  useUpdatePublicInterviewLinksMutation,
  useWorkspaceQuery,
} from "../requests/workspace.generated";

export const PublicInterviewLinkSetting = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const { data, loading } = useWorkspaceQuery({
    variables: { id: workspaceId },
  });
  const [updatePublicInterviewLinks] = useUpdatePublicInterviewLinksMutation();

  if (loading) {
    return undefined;
  }

  const current = data?.workspace?.publicInterviewLinks;

  return (
    <FormControl paddingBottom="16px" maxWidth="650px">
      <Checkbox
        type="checkbox"
        name="publicInterviewLinks"
        isChecked={current}
        colorScheme="brand"
        onChange={() =>
          updatePublicInterviewLinks({
            variables: { publicInterviewLinks: !current, workspaceId },
          })
        }
      >
        Interviews visible to anyone with the link
      </Checkbox>
      <FormHelperText>
        Allows sharing interview links with anyone on the internet. If disabled,
        your interviews can only be viewed by other members of your workspace
      </FormHelperText>
    </FormControl>
  );
};
