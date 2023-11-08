import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { ReactNode } from "react";
import DebounceLink from "apollo-link-debounce";

const DEFAULT_DEBOUNCE_TIMEOUT = 300;

const link = ApolloLink.from([
  new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT),
  new HttpLink({ uri: "/graphql" }),
]);

export const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Project: {
        fields: {
          projectTags: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
      Highlight: {
        fields: {
          tags: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
      Interview: {
        fields: {
          highlights: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
      User: {
        fields: {
          pendingWorkspaceInvites: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  credentials: "include",
  link,
});

export const GraphqlProvider = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
