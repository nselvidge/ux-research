import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { Router } from "./routes/Router";
import { GraphqlProvider } from "./global/apollo";
import { theme } from "./theme";
import { RecoilRoot } from "recoil";

import "./app.less";
import { useInitAnalytics } from "./domains/analytics/tracker";
import { ErrorBoundary } from "./global/ErrorBoundary";

const Analytics: React.FC = () => {
  useInitAnalytics();
  return undefined;
};

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary>
        <GraphqlProvider>
          <RecoilRoot>
            <Analytics />
            <Router />
          </RecoilRoot>
        </GraphqlProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
};
