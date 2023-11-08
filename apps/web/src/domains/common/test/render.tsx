import React from "react";
import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import { GraphqlProvider } from "~/global/apollo";
import { ChakraProvider } from "@chakra-ui/react";

export const render = (ui: React.ReactElement, options?: RenderOptions) =>
  rtlRender(ui, {
    wrapper: ({ children }) => (
      <ChakraProvider>
        <GraphqlProvider>
          <RecoilRoot>{children}</RecoilRoot>
        </GraphqlProvider>
      </ChakraProvider>
    ),
    ...options,
  });
