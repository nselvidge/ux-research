import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "wouter";
import { useFlashError } from "../state/flashError";
import { useSearchParameter } from "../state/useSearchParameter";

export const SignupWithoutEmail = () => {
  const errorMessage = useFlashError();
  const workspace = useSearchParameter("workspace", false);
  const redirect = useSearchParameter("redirect", false);

  return (
    <Box padding="25px" minWidth="350px" maxWidth="450px" textAlign="center">
      <Heading marginBottom="12px">Sign up</Heading>
      {errorMessage && (
        <Alert status="error">
          <AlertIcon />
          {errorMessage}
        </Alert>
      )}
      {workspace && (
        <Alert status="info">
          <AlertIcon />
          Sign up to join {workspace}
        </Alert>
      )}
      <Flex justifyContent="center" alignItems="center">
        <Button
          margin="12px auto"
          as="a"
          href={redirect ? `/zoom/signup?redirect=${redirect}` : "/zoom/signup"}
          variant="brand"
        >
          Sign up with Zoom
        </Button>
      </Flex>

      <Text variant="caption" marginTop="12px">
        Signing up with Zoom will install the Resonate Zoom app on your account.
      </Text>
      <Text variant="caption" marginTop="12px">
        Already have an account?{" "}
        <Button
          as={Link}
          href={redirect ? `/login?redirect=${redirect}` : "/login"}
          variant="link"
        >
          log in
        </Button>{" "}
        instead.
      </Text>
    </Box>
  );
};
