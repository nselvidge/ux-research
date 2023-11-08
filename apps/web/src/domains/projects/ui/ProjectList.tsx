import { Flex, Grid, Link as A } from "@chakra-ui/layout";
import React from "react";
import { FullPageSpinner } from "~/domains/common/ui/FullPageSpinner";
import { GenericErrorMessage } from "~/domains/common/ui/GenericErrorMessage";
import { useWorkspaceProjectsQuery } from "../requests/projects.generated";
import { ProjectCard } from "./ProjectCard";
import { EmptyProjectList } from "./EmptyProjectList";
import { Link } from "wouter";

export const ProjectList = ({ workspaceId }: { workspaceId: string }) => {
  const { data, loading, error } = useWorkspaceProjectsQuery({
    variables: { workspaceId },
  });

  if (error) {
    return <GenericErrorMessage errorData={error} />;
  }

  if (loading) {
    return <FullPageSpinner />;
  }

  if (data?.workspace?.projects?.length === 0) {
    return <EmptyProjectList workspaceId={workspaceId} />;
  }

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
      }}
      gridGap="16px 16px"
      justifyContent="space-evenly"
      alignItems="stretch"
    >
      {data?.workspace?.projects?.map((project) => (
        <Link href={`/project/${project.id}`} key={project.id}>
          <A
            _hover={{
              textDecoration: "none",
            }}
            height="100%"
            alignItems="stretch"
            display="flex"
          >
            <ProjectCard
              name={project.name}
              description={project.description}
              interviewCount={project.interviewCount}
            />
          </A>
        </Link>
      ))}
    </Grid>
  );
};
