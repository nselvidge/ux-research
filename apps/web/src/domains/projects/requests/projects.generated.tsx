import * as Types from '../../../global/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type WorkspaceProjectsQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
}>;


export type WorkspaceProjectsQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, projects: Array<{ __typename?: 'Project', id: string, name: string, description: string, interviewCount: number } | null> } | null };

export type CreateProjectMutationVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
  name: Types.Scalars['String'];
  description: Types.Scalars['String'];
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', id: string, name: string, description: string, interviewCount: number } };

export type ProjectQueryVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
}>;


export type ProjectQuery = { __typename?: 'Query', project: { __typename?: 'Project', id: string, name: string, description: string, interviewCount: number, taglessHighlightCounts: number, highlightCounts: Array<{ __typename?: 'TagHighlightCounts', tagId: string, highlightCount: number } | null>, interviewTags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string, isDefault: boolean } | null>, interviews: Array<{ __typename?: 'Interview', id: string, name: string, date: any, highlights: Array<{ __typename?: 'Highlight', id: string } | null>, pendingHighlights: Array<{ __typename?: 'PendingHighlight', id: string } | null>, creator: { __typename?: 'InterviewCreator', fullName: string }, recording?: { __typename?: 'Video', id: string, previewGifUrl?: string | null, previewImageUrl?: string | null } | null } | null> } };

export type MoveInterviewsToProjectMutationVariables = Types.Exact<{
  interviewIds: Array<Types.Scalars['String']> | Types.Scalars['String'];
  projectId: Types.Scalars['String'];
}>;


export type MoveInterviewsToProjectMutation = { __typename?: 'Mutation', moveInterviewsToProject: { __typename?: 'Project', id: string, name: string, description: string, interviewCount: number, taglessHighlightCounts: number, highlightCounts: Array<{ __typename?: 'TagHighlightCounts', tagId: string, highlightCount: number } | null>, interviewTags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string, isDefault: boolean } | null>, interviews: Array<{ __typename?: 'Interview', id: string, projectId?: string | null, name: string, date: any, highlights: Array<{ __typename?: 'Highlight', id: string } | null>, pendingHighlights: Array<{ __typename?: 'PendingHighlight', id: string } | null>, creator: { __typename?: 'InterviewCreator', fullName: string }, recording?: { __typename?: 'Video', id: string, previewGifUrl?: string | null, previewImageUrl?: string | null } | null } | null> } };

export type UpdateProjectMutationVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
  name?: Types.InputMaybe<Types.Scalars['String']>;
  description?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject: { __typename?: 'Project', id: string, name: string, description: string, interviewCount: number, taglessHighlightCounts: number, highlightCounts: Array<{ __typename?: 'TagHighlightCounts', tagId: string, highlightCount: number } | null>, interviewTags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string, isDefault: boolean } | null>, interviews: Array<{ __typename?: 'Interview', id: string, name: string, date: any, highlights: Array<{ __typename?: 'Highlight', id: string } | null>, pendingHighlights: Array<{ __typename?: 'PendingHighlight', id: string } | null>, creator: { __typename?: 'InterviewCreator', fullName: string }, recording?: { __typename?: 'Video', id: string, previewGifUrl?: string | null, previewImageUrl?: string | null } | null } | null> } };


export const WorkspaceProjectsDocument = gql`
    query workspaceProjects($workspaceId: String!) {
  workspace(id: $workspaceId) {
    id
    projects {
      id
      name
      description
      interviewCount
    }
  }
}
    `;

/**
 * __useWorkspaceProjectsQuery__
 *
 * To run a query within a React component, call `useWorkspaceProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceProjectsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useWorkspaceProjectsQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceProjectsQuery, WorkspaceProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceProjectsQuery, WorkspaceProjectsQueryVariables>(WorkspaceProjectsDocument, options);
      }
export function useWorkspaceProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceProjectsQuery, WorkspaceProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceProjectsQuery, WorkspaceProjectsQueryVariables>(WorkspaceProjectsDocument, options);
        }
export type WorkspaceProjectsQueryHookResult = ReturnType<typeof useWorkspaceProjectsQuery>;
export type WorkspaceProjectsLazyQueryHookResult = ReturnType<typeof useWorkspaceProjectsLazyQuery>;
export type WorkspaceProjectsQueryResult = Apollo.QueryResult<WorkspaceProjectsQuery, WorkspaceProjectsQueryVariables>;
export const CreateProjectDocument = gql`
    mutation createProject($workspaceId: String!, $name: String!, $description: String!) {
  createProject(workspaceId: $workspaceId, name: $name, description: $description) {
    id
    name
    description
    interviewCount
  }
}
    `;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const ProjectDocument = gql`
    query project($projectId: String!) {
  project(id: $projectId) {
    id
    name
    description
    interviewCount
    highlightCounts {
      tagId
      highlightCount
    }
    taglessHighlightCounts
    interviewTags {
      id
      name
      color
      emoji
      isDefault
    }
    interviews {
      id
      name
      date
      highlights {
        id
      }
      pendingHighlights {
        id
      }
      creator {
        fullName
      }
      recording {
        id
        previewGifUrl
        previewImageUrl
      }
    }
  }
}
    `;

/**
 * __useProjectQuery__
 *
 * To run a query within a React component, call `useProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useProjectQuery(baseOptions: Apollo.QueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, options);
      }
export function useProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, options);
        }
export type ProjectQueryHookResult = ReturnType<typeof useProjectQuery>;
export type ProjectLazyQueryHookResult = ReturnType<typeof useProjectLazyQuery>;
export type ProjectQueryResult = Apollo.QueryResult<ProjectQuery, ProjectQueryVariables>;
export const MoveInterviewsToProjectDocument = gql`
    mutation moveInterviewsToProject($interviewIds: [String!]!, $projectId: String!) {
  moveInterviewsToProject(interviewIds: $interviewIds, projectId: $projectId) {
    id
    name
    description
    interviewCount
    highlightCounts {
      tagId
      highlightCount
    }
    taglessHighlightCounts
    interviewTags {
      id
      name
      color
      emoji
      isDefault
    }
    interviews {
      id
      projectId
      name
      date
      highlights {
        id
      }
      pendingHighlights {
        id
      }
      creator {
        fullName
      }
      recording {
        id
        previewGifUrl
        previewImageUrl
      }
    }
  }
}
    `;
export type MoveInterviewsToProjectMutationFn = Apollo.MutationFunction<MoveInterviewsToProjectMutation, MoveInterviewsToProjectMutationVariables>;

/**
 * __useMoveInterviewsToProjectMutation__
 *
 * To run a mutation, you first call `useMoveInterviewsToProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveInterviewsToProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveInterviewsToProjectMutation, { data, loading, error }] = useMoveInterviewsToProjectMutation({
 *   variables: {
 *      interviewIds: // value for 'interviewIds'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useMoveInterviewsToProjectMutation(baseOptions?: Apollo.MutationHookOptions<MoveInterviewsToProjectMutation, MoveInterviewsToProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveInterviewsToProjectMutation, MoveInterviewsToProjectMutationVariables>(MoveInterviewsToProjectDocument, options);
      }
export type MoveInterviewsToProjectMutationHookResult = ReturnType<typeof useMoveInterviewsToProjectMutation>;
export type MoveInterviewsToProjectMutationResult = Apollo.MutationResult<MoveInterviewsToProjectMutation>;
export type MoveInterviewsToProjectMutationOptions = Apollo.BaseMutationOptions<MoveInterviewsToProjectMutation, MoveInterviewsToProjectMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation updateProject($projectId: String!, $name: String, $description: String) {
  updateProject(projectId: $projectId, name: $name, description: $description) {
    id
    name
    description
    interviewCount
    highlightCounts {
      tagId
      highlightCount
    }
    taglessHighlightCounts
    interviewTags {
      id
      name
      color
      emoji
      isDefault
    }
    interviews {
      id
      name
      date
      highlights {
        id
      }
      pendingHighlights {
        id
      }
      creator {
        fullName
      }
      recording {
        id
        previewGifUrl
        previewImageUrl
      }
    }
  }
}
    `;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, options);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;