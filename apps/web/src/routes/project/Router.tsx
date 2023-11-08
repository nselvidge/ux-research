import React from "react";
import { Template } from "~/domains/page/ui/Template";
import { Route } from "wouter";
import { ProjectListRoute } from "./ProjectListRoute";
import { ProjectHomeRoute } from "./ProjectHomeRoute";
import { ProjectTaglessHighlightsRoute } from "./ProjectTaglessHighlightsRoute";
import { ProjectTagHighlightsRoute } from "./ProjectTagHighlightsRoute";
import { ProjectTagManagementRoute } from "./ProjectTagManagementRoute";
import { ProjectSidebar } from "~/domains/projects/ui/ProjectSidebar";
import { Flex, Grid, GridItem } from "@chakra-ui/layout";
import { useProjectQuery } from "~/domains/projects/requests/projects.generated";
import { FullPageSpinner } from "~/domains/common/ui/FullPageSpinner";
import { ProjectHeader } from "../../domains/projects/ui/ProjectHeader";

const SingleProjectRouter = ({ projectId }: { projectId: string }) => {
  const { data, loading } = useProjectQuery({
    variables: {
      projectId,
    },
  });

  if (loading) {
    return <FullPageSpinner />;
  }

  return (
    <Template cream>
      <Flex width="100%" justifyContent="center">
        <Flex
          direction="column"
          flexGrow={1}
          maxWidth="1600px"
          width="100%"
          padding="0px 32px"
        >
          <ProjectHeader
            projectId={projectId}
            projectName={data?.project?.name}
            projectDescription={data?.project?.description}
          />
          <Grid
            templateColumns={{
              base: "1fr",
              lg: "repeat(12, 1fr)",
            }}
            columnGap="32px"
            alignItems="start"
            width="100%"
          >
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <ProjectSidebar projectId={projectId} />
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 10 }}>
              <Route path="/project/:projectId/tags">
                {({ projectId }) => (
                  <ProjectTagManagementRoute projectId={projectId} />
                )}
              </Route>
              <Route path="/project/:projectId">
                {({ projectId }) => <ProjectHomeRoute projectId={projectId} />}
              </Route>
              <Route path="/project/:projectId/tag/:tagId">
                {({ projectId, tagId }) =>
                  tagId === "tagless" ? (
                    <ProjectTaglessHighlightsRoute projectId={projectId} />
                  ) : (
                    <ProjectTagHighlightsRoute
                      projectId={projectId}
                      tagId={tagId}
                    />
                  )
                }
              </Route>
            </GridItem>
          </Grid>
        </Flex>
      </Flex>
    </Template>
  );
};

export const ProjectRouter = () => {
  return (
    <>
      <Route path="/projects">
        <ProjectListRoute />
      </Route>
      <Route path="/project/:projectId/:nested?/:tagId?">
        {({ projectId }) => <SingleProjectRouter projectId={projectId} />}
      </Route>
    </>
  );
};
