import React, { Suspense, useEffect } from "react";
import { Route, useLocation } from "wouter";
import { InterviewRoute } from "./InterviewRoute";
import { InterviewListRoute } from "./InterviewListRoute";
import { UploadRoute } from "./UploadRoute";
import { ImportRoute } from "./ImportRoute";
import { SignupRoute } from "./SignupRoute";
import { LoginRoute } from "./LoginRoute";
import { useFlashCode } from "~/domains/page/state/flashCode";
import { ZoomClientRouteV2 } from "./ZoomClientRouteV2";
import { CircularProgress, Flex } from "@chakra-ui/react";
import { NewZoomConnection } from "./NewZoomConnection";
import { ConnectZoomAccountRoute } from "./ConnectZoomAccountRoute";
import { ZoomAccountClaimedRoute } from "./ZoomAccountClaimed";
import { WorkspaceRouter } from "./workspace/Router";
import { HighlightRoute } from "./HighlightRoute";
import { TagHighlightsRoute } from "./TagHighlightsRoute";
import { EmailSignupRoute } from "./EmailSignupRoute";
import { InterviewSummaryRoute } from "./InterviewSummaryRoute";
import { TaglessHighlightsRoute } from "./TaglessHighlightsRoute";
import { ProjectRouter } from "./project/Router";
import { useMeQuery } from "~/domains/page/requests/page.generated";
import { HandleInviteRoute } from "./HandleInviteRoute";
import { ZoomClientRoute } from "./ZoomClientRoute";

export const Router = () => {
  useFlashCode();
  const { data } = useMeQuery();
  const [location, redirect] = useLocation();

  useEffect(() => {
    if (
      data?.me?.pendingWorkspaceInvites?.length > 0 &&
      window.location.pathname !== "/handle-invite"
    ) {
      redirect(
        `/handle-invite?redirect=${encodeURIComponent(
          window.location.pathname
        )}`
      );
    }
  }, [data]);

  return (
    <Suspense
      fallback={
        <Flex
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          backgroundColor="cream.300"
        >
          <CircularProgress color="brand.500" isIndeterminate />
        </Flex>
      }
    >
      <Route path="/interview/:id">
        {({ id }: { id: string }) => <InterviewRoute id={id} />}
      </Route>
      <Route path="/interview/:id/summary">
        {({ id }: { id: string }) => <InterviewSummaryRoute id={id} />}
      </Route>

      <Route path="/highlight/:id">
        {({ id }: { id: string }) => <HighlightRoute id={id} />}
      </Route>

      <Route path="/tag/:id">
        {({ id }: { id: string }) =>
          id === "tagless" ? (
            <TaglessHighlightsRoute />
          ) : (
            <TagHighlightsRoute tagId={id} />
          )
        }
      </Route>

      <Route path="/">
        <InterviewListRoute />
      </Route>
      <Route path="/upload">
        <UploadRoute />
      </Route>
      <Route path="/import">
        <ImportRoute />
      </Route>
      <Route path="/signup">
        <SignupRoute />
      </Route>
      {window.location.hostname !== "www.resonateapp.com" && (
        <Route path="/email-signup">
          <EmailSignupRoute />
        </Route>
      )}
      <Route path="/login">
        <LoginRoute />
      </Route>
      <Route path="/zoom-client">
        <ZoomClientRoute />
      </Route>
      <Route path="/v2/zoom-client">
        <ZoomClientRouteV2 />
      </Route>
      <Route path="/new-zoom-connection">
        <NewZoomConnection />
      </Route>
      <Route path="/connect-zoom-account">
        <ConnectZoomAccountRoute />
      </Route>
      <Route path="/zoom-account-claimed">
        <ZoomAccountClaimedRoute />
      </Route>
      <Route path="/handle-invite">
        <HandleInviteRoute />
      </Route>
      <ProjectRouter />
      <WorkspaceRouter />
    </Suspense>
  );
};
