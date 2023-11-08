import { Box } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { useRedirectIfNotLoggedIn } from "~/domains/page/state/redirectIfNotLoggedIn";
import { NotificationPreferences } from "~/domains/userPreferences/ui/NotificationPreferences";

export const UserPreferencesRoute = () => {
  useRedirectIfNotLoggedIn("workspace/user-preferences");
  useTrackOnce("Screen Viewed", {
    screen: "User Preferences",
  });

  return (
    <Box width="100%">
      <NotificationPreferences />
    </Box>
  );
};
