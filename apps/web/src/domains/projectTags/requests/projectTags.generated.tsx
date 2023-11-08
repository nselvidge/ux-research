import * as Types from '../../../global/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProjectTagsQueryVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
}>;


export type ProjectTagsQuery = { __typename?: 'Query', project: { __typename?: 'Project', id: string, projectTags: Array<{ __typename?: 'ProjectTag', position: number, tag: { __typename?: 'Tag', id: string, name: string, color: Types.TagColor, isDefault: boolean, emoji: string } } | null> } };

export type AddProjectTagMutationVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
  tagId: Types.Scalars['String'];
}>;


export type AddProjectTagMutation = { __typename?: 'Mutation', addProjectTagToProject: { __typename?: 'Project', id: string, projectTags: Array<{ __typename?: 'ProjectTag', position: number, tag: { __typename?: 'Tag', id: string, name: string, color: Types.TagColor, isDefault: boolean, emoji: string } } | null> } };

export type RemoveProjectTagMutationVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
  tagId: Types.Scalars['String'];
}>;


export type RemoveProjectTagMutation = { __typename?: 'Mutation', removeProjectTagFromProject: { __typename?: 'Project', id: string, projectTags: Array<{ __typename?: 'ProjectTag', position: number, tag: { __typename?: 'Tag', id: string, name: string, color: Types.TagColor, isDefault: boolean, emoji: string } } | null> } };

export type UpdateProjectTagPositionsMutationVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
  tagIds: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;


export type UpdateProjectTagPositionsMutation = { __typename?: 'Mutation', updateProjectTagPositions: { __typename?: 'Project', id: string, projectTags: Array<{ __typename?: 'ProjectTag', position: number, tag: { __typename?: 'Tag', id: string, name: string, color: Types.TagColor, isDefault: boolean, emoji: string } } | null> } };


export const ProjectTagsDocument = gql`
    query projectTags($projectId: String!) {
  project(id: $projectId) {
    id
    projectTags {
      position
      tag {
        id
        name
        color
        isDefault
        emoji
      }
    }
  }
}
    `;

/**
 * __useProjectTagsQuery__
 *
 * To run a query within a React component, call `useProjectTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectTagsQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useProjectTagsQuery(baseOptions: Apollo.QueryHookOptions<ProjectTagsQuery, ProjectTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProjectTagsQuery, ProjectTagsQueryVariables>(ProjectTagsDocument, options);
      }
export function useProjectTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectTagsQuery, ProjectTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProjectTagsQuery, ProjectTagsQueryVariables>(ProjectTagsDocument, options);
        }
export type ProjectTagsQueryHookResult = ReturnType<typeof useProjectTagsQuery>;
export type ProjectTagsLazyQueryHookResult = ReturnType<typeof useProjectTagsLazyQuery>;
export type ProjectTagsQueryResult = Apollo.QueryResult<ProjectTagsQuery, ProjectTagsQueryVariables>;
export const AddProjectTagDocument = gql`
    mutation addProjectTag($projectId: String!, $tagId: String!) {
  addProjectTagToProject(projectId: $projectId, tagId: $tagId) {
    id
    projectTags {
      position
      tag {
        id
        name
        color
        isDefault
        emoji
      }
    }
  }
}
    `;
export type AddProjectTagMutationFn = Apollo.MutationFunction<AddProjectTagMutation, AddProjectTagMutationVariables>;

/**
 * __useAddProjectTagMutation__
 *
 * To run a mutation, you first call `useAddProjectTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProjectTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProjectTagMutation, { data, loading, error }] = useAddProjectTagMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      tagId: // value for 'tagId'
 *   },
 * });
 */
export function useAddProjectTagMutation(baseOptions?: Apollo.MutationHookOptions<AddProjectTagMutation, AddProjectTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProjectTagMutation, AddProjectTagMutationVariables>(AddProjectTagDocument, options);
      }
export type AddProjectTagMutationHookResult = ReturnType<typeof useAddProjectTagMutation>;
export type AddProjectTagMutationResult = Apollo.MutationResult<AddProjectTagMutation>;
export type AddProjectTagMutationOptions = Apollo.BaseMutationOptions<AddProjectTagMutation, AddProjectTagMutationVariables>;
export const RemoveProjectTagDocument = gql`
    mutation removeProjectTag($projectId: String!, $tagId: String!) {
  removeProjectTagFromProject(projectId: $projectId, tagId: $tagId) {
    id
    projectTags {
      position
      tag {
        id
        name
        color
        isDefault
        emoji
      }
    }
  }
}
    `;
export type RemoveProjectTagMutationFn = Apollo.MutationFunction<RemoveProjectTagMutation, RemoveProjectTagMutationVariables>;

/**
 * __useRemoveProjectTagMutation__
 *
 * To run a mutation, you first call `useRemoveProjectTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProjectTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProjectTagMutation, { data, loading, error }] = useRemoveProjectTagMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      tagId: // value for 'tagId'
 *   },
 * });
 */
export function useRemoveProjectTagMutation(baseOptions?: Apollo.MutationHookOptions<RemoveProjectTagMutation, RemoveProjectTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveProjectTagMutation, RemoveProjectTagMutationVariables>(RemoveProjectTagDocument, options);
      }
export type RemoveProjectTagMutationHookResult = ReturnType<typeof useRemoveProjectTagMutation>;
export type RemoveProjectTagMutationResult = Apollo.MutationResult<RemoveProjectTagMutation>;
export type RemoveProjectTagMutationOptions = Apollo.BaseMutationOptions<RemoveProjectTagMutation, RemoveProjectTagMutationVariables>;
export const UpdateProjectTagPositionsDocument = gql`
    mutation updateProjectTagPositions($projectId: String!, $tagIds: [String!]!) {
  updateProjectTagPositions(projectId: $projectId, tagIds: $tagIds) {
    id
    projectTags {
      position
      tag {
        id
        name
        color
        isDefault
        emoji
      }
    }
  }
}
    `;
export type UpdateProjectTagPositionsMutationFn = Apollo.MutationFunction<UpdateProjectTagPositionsMutation, UpdateProjectTagPositionsMutationVariables>;

/**
 * __useUpdateProjectTagPositionsMutation__
 *
 * To run a mutation, you first call `useUpdateProjectTagPositionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectTagPositionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectTagPositionsMutation, { data, loading, error }] = useUpdateProjectTagPositionsMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      tagIds: // value for 'tagIds'
 *   },
 * });
 */
export function useUpdateProjectTagPositionsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectTagPositionsMutation, UpdateProjectTagPositionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectTagPositionsMutation, UpdateProjectTagPositionsMutationVariables>(UpdateProjectTagPositionsDocument, options);
      }
export type UpdateProjectTagPositionsMutationHookResult = ReturnType<typeof useUpdateProjectTagPositionsMutation>;
export type UpdateProjectTagPositionsMutationResult = Apollo.MutationResult<UpdateProjectTagPositionsMutation>;
export type UpdateProjectTagPositionsMutationOptions = Apollo.BaseMutationOptions<UpdateProjectTagPositionsMutation, UpdateProjectTagPositionsMutationVariables>;