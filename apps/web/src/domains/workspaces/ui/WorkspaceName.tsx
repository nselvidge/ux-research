import {
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  IconButton,
  Skeleton,
  useEditableControls,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  useUpdateWorkspaceNameMutation,
  useWorkspaceQuery,
} from "../requests/workspace.generated";
import { FaEdit } from "react-icons/fa";

interface WorkspaceNameProps {
  workspaceId: string;
}

const EditControls = () => {
  const { isEditing, getEditButtonProps } = useEditableControls();

  return (
    !isEditing && (
      <IconButton
        {...getEditButtonProps()}
        variant="ghost"
        marginRight="5px"
        aria-label="edit workspace name"
        marginBottom="7px"
        icon={<FaEdit />}
      />
    )
  );
};

export const WorkspaceName = ({ workspaceId }: WorkspaceNameProps) => {
  const [value, setValue] = useState("");
  const { data, loading, error } = useWorkspaceQuery({
    variables: { id: workspaceId },
    skip: !workspaceId,
  });

  const [changeName] = useUpdateWorkspaceNameMutation();

  useEffect(() => {
    setValue(data?.workspace?.name);
  }, [data?.workspace?.name]);

  if (error) {
    return null;
  }

  if (loading) {
    return (
      <Heading>
        <Skeleton />
      </Heading>
    );
  }

  return (
    <Editable
      defaultValue={data?.workspace.name}
      onSubmit={(newValue) =>
        changeName({ variables: { id: workspaceId, name: newValue } })
      }
      value={value}
      onChange={setValue}
      marginBottom="15px"
    >
      <Heading>
        <EditControls />
        <EditablePreview />
        <EditableInput />
      </Heading>
    </Editable>
  );
};
