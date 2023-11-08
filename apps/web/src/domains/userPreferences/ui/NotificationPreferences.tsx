import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Checkbox, CircularProgress } from "@chakra-ui/react";
import React from "react";
import {
  NotificationPreferencesDocument,
  useNotificationPreferencesQuery,
  useUpdateEmailPreferencesMutation,
} from "../requests/notificationPreferences.generated";

export const NotificationPreferences = () => {
  const { data, loading } = useNotificationPreferencesQuery();
  const [updateEmailPreference] = useUpdateEmailPreferencesMutation({
    refetchQueries: [{ query: NotificationPreferencesDocument }],
  });

  if (loading) {
    return <CircularProgress isIndeterminate color="brand.500" />;
  }

  const current = data?.me?.notificationPreferences
    ? data.me.notificationPreferences.notificationEmails
    : true;

  return (
    <Flex direction="column">
      <Heading marginBottom="12px" variant="title">
        Notification Preferences
      </Heading>
      <Flex>
        <Checkbox
          marginRight="5px"
          isChecked={current}
          onChange={() => {
            updateEmailPreference({
              variables: {
                notificationEmails: !current,
              },
              optimisticResponse: {
                updateEmailPreference: {
                  __typename: "NotificationPreferences",
                  id: data?.me?.notificationPreferences?.id,
                  notificationEmails: !current,
                },
              },
            });
          }}
        />
        <Text variant="body">Email Notifications</Text>
      </Flex>
      <Text variant="caption">
        This includes email notifications when interviews are ready to watch.
      </Text>
    </Flex>
  );
};
