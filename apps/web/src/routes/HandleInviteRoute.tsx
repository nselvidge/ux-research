import { Flex } from "@chakra-ui/layout";
import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { FullPageSpinner } from "~/domains/common/ui/FullPageSpinner";
import { useMeQuery } from "~/domains/page/requests/page.generated";
import { useRedirectIfNotLoggedIn } from "~/domains/page/state/redirectIfNotLoggedIn";
import { AcceptInvite } from "~/domains/workspaces/ui/AcceptInvite";

export const HandleInviteRoute = () => {
  const { data, loading } = useMeQuery();

  const [, redirect] = useLocation();

  useRedirectIfNotLoggedIn("/");

  useEffect(() => {
    console.log(data);
    if (data?.me?.pendingWorkspaceInvites?.length === 0) {
      const url = new URL(window.location.href);
      const redirectUrl = url.searchParams.get("redirect") || "/";
      redirect(redirectUrl);
    }
  }, [data]);

  if (loading) {
    return <FullPageSpinner />;
  }

  const firstInvite = data?.me?.pendingWorkspaceInvites?.[0];

  if (!firstInvite) {
    return <FullPageSpinner />;
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      height="100%"
      width="100%"
    >
      <AcceptInvite pendingWorkspaceInvite={firstInvite} />
    </Flex>
  );
};
