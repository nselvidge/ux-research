import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { Link } from "wouter";
import React from "react";

export const ZoomAuth = () => {
  return (
    <Flex
      border="1px #E0E0E0 solid"
      padding="25px"
      maxWidth="350px"
      direction="column"
    >
      <Alert
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        status="info"
        marginBottom="15px"
        padding="35px 15px"
      >
        <AlertIcon boxSize="40px" marginBottom="10px" />
        <AlertTitle fontSize="lg" marginBottom="10px">
          Welcome to Resonate
        </AlertTitle>
        <AlertDescription>
          We haven't seen your Zoom account before. Login to connect it to your
          existing account, or signup to create a new account.
        </AlertDescription>
      </Alert>
      <Button
        as={Link}
        href={`/connect-zoom-account?redirect=${encodeURIComponent(
          "zoom/connect"
        )}`}
        margin="10px"
      >
        Log in
      </Button>
      <Divider />
      <Button as="a" href="/zoom/signup" margin="10px">
        Sign up with Zoom
      </Button>
    </Flex>
  );
};
