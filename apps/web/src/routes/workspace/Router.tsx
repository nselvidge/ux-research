import React from "react";
import { Template } from "~/domains/page/ui/Template";
import {
  WorkspaceNavigation,
  WorkspaceNavigationContent,
} from "~/domains/workspaces/ui/WorkspaceNavigation";
import { Route } from "wouter";
import { MembershipSettingsRoute } from "./MembershipSettingsRoute";
import { TagSettingsRoute } from "./TagSettingsRoute";
import { UserPreferencesRoute } from "./UserPreferencesRoute";

export const WorkspaceRouter = () => {
  return (
    <Route path="/workspace/:nested">
      <Template cream>
        <WorkspaceNavigation />
        <WorkspaceNavigationContent>
          <Route path="/workspace/members">
            <MembershipSettingsRoute />
          </Route>
          <Route path="/workspace/tags">
            <TagSettingsRoute />
          </Route>
          <Route path="/workspace/user-preferences">
            <UserPreferencesRoute />
          </Route>
        </WorkspaceNavigationContent>
      </Template>
    </Route>
  );
};
