import React, { useState } from "react";
import { Flex, Link, Text } from "@chakra-ui/layout";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from "@chakra-ui/react";
import { ErrorBoundary as SentryBoundary } from "@sentry/react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Add error boundary to the app
export const ErrorBoundary = ({
  children,
}: ErrorBoundaryProps): React.ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SentryBoundary
      fallback={(errorData) => (
        <Flex
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            maxWidth="500px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Something went wrong.
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              <Text>
                Reach out to the Resonate team at{" "}
                <Link href="mailto:help@resonateapp.com">
                  help@resonateapp.com
                </Link>
              </Text>
              <Button
                marginTop="8px"
                variant="link"
                onClick={() => setIsExpanded((isExpanded) => !isExpanded)}
              >
                {!isExpanded ? "Show error" : "Hide Error"}
              </Button>
              {isExpanded && (
                <Flex
                  textAlign="left"
                  overflow="scroll"
                  width="100%"
                  justifyContent="left"
                >
                  <pre>{JSON.stringify(errorData, null, 2)}</pre>
                </Flex>
              )}
            </AlertDescription>
          </Alert>
        </Flex>
      )}
    >
      {children}
    </SentryBoundary>
  );
};
