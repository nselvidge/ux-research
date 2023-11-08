import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { string } from "yup";

import { useSendInviteEmailMutation } from "../requests/workspace.generated";

// eslint-disable-next-line
const { AsyncSelect } = require("chakra-react-select");

interface AddMember {
  workspaceId: string;
  onAddMember: () => void;
}

const emailValidator = string()
  .email("Please enter a valid email")
  .required("Please enter an email");

export const InviteMember = ({ workspaceId, onAddMember }: AddMember) => {
  const [value, setValue] = useState<string>("");

  const [inviteMember, { loading, error: apolloError }] =
    useSendInviteEmailMutation();
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    if (apolloError) {
      setError(apolloError);
    }
  }, [apolloError]);

  const handleSubmit = async () => {
    try {
      await emailValidator.validate(value);
    } catch (err) {
      setError(err);
      return;
    }
    await inviteMember({
      variables: {
        workspaceId,
        email: value,
      },
    });
    setValue("");
    onAddMember();
  };

  return (
    <Flex>
      <form
        style={{ width: "100%" }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <FormControl isInvalid={!!error}>
          <FormErrorMessage>
            {error?.message || "Something went wrong"}
          </FormErrorMessage>
          <Flex>
            <Input
              value={value}
              onChange={(e) => {
                setError(null);
                setValue(e.target.value);
              }}
              borderRadius="8px 0px 0px 8px"
            />
            <Button
              borderRadius="0px 8px 8px 0px"
              variant="brand"
              leftIcon={<FaPlus />}
              onClick={handleSubmit}
              isLoading={loading}
            >
              Invite
            </Button>
          </Flex>
        </FormControl>
      </form>
    </Flex>
  );
};
