import * as Types from '../../../global/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteTagMutationVariables = Types.Exact<{
  tagId: Types.Scalars['String'];
}>;


export type DeleteTagMutation = { __typename?: 'Mutation', deleteTag: { __typename?: 'Workspace', id: string, tags?: Array<{ __typename?: 'Tag', id: string } | null> | null } };

export type UpdateTagNameMutationVariables = Types.Exact<{
  tagId: Types.Scalars['String'];
  name: Types.Scalars['String'];
}>;


export type UpdateTagNameMutation = { __typename?: 'Mutation', updateTagName: { __typename?: 'Tag', id: string, name: string } };

export type UpdateTagColorMutationVariables = Types.Exact<{
  tagId: Types.Scalars['String'];
  color: Types.TagColor;
}>;


export type UpdateTagColorMutation = { __typename?: 'Mutation', updateTagColor: { __typename?: 'Tag', id: string, color: Types.TagColor } };

export type UpdateTagEmojiMutationVariables = Types.Exact<{
  tagId: Types.Scalars['String'];
  emoji: Types.Scalars['String'];
}>;


export type UpdateTagEmojiMutation = { __typename?: 'Mutation', updateTagEmoji: { __typename?: 'Tag', id: string, emoji: string } };

export type WorkspaceTagDetailsQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type WorkspaceTagDetailsQuery = { __typename?: 'Query', getTaglessHighlightCounts: number, workspace?: { __typename?: 'Workspace', tags?: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string, isDefault: boolean } | null> | null } | null, getTagHighlightCounts: Array<{ __typename?: 'TagHighlightCounts', tagId: string, highlightCount: number } | null> };


export const DeleteTagDocument = gql`
    mutation deleteTag($tagId: String!) {
  deleteTag(tagId: $tagId) {
    id
    tags {
      id
    }
  }
}
    `;
export type DeleteTagMutationFn = Apollo.MutationFunction<DeleteTagMutation, DeleteTagMutationVariables>;

/**
 * __useDeleteTagMutation__
 *
 * To run a mutation, you first call `useDeleteTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTagMutation, { data, loading, error }] = useDeleteTagMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *   },
 * });
 */
export function useDeleteTagMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTagMutation, DeleteTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTagMutation, DeleteTagMutationVariables>(DeleteTagDocument, options);
      }
export type DeleteTagMutationHookResult = ReturnType<typeof useDeleteTagMutation>;
export type DeleteTagMutationResult = Apollo.MutationResult<DeleteTagMutation>;
export type DeleteTagMutationOptions = Apollo.BaseMutationOptions<DeleteTagMutation, DeleteTagMutationVariables>;
export const UpdateTagNameDocument = gql`
    mutation updateTagName($tagId: String!, $name: String!) {
  updateTagName(tagId: $tagId, name: $name) {
    id
    name
  }
}
    `;
export type UpdateTagNameMutationFn = Apollo.MutationFunction<UpdateTagNameMutation, UpdateTagNameMutationVariables>;

/**
 * __useUpdateTagNameMutation__
 *
 * To run a mutation, you first call `useUpdateTagNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTagNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTagNameMutation, { data, loading, error }] = useUpdateTagNameMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateTagNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTagNameMutation, UpdateTagNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTagNameMutation, UpdateTagNameMutationVariables>(UpdateTagNameDocument, options);
      }
export type UpdateTagNameMutationHookResult = ReturnType<typeof useUpdateTagNameMutation>;
export type UpdateTagNameMutationResult = Apollo.MutationResult<UpdateTagNameMutation>;
export type UpdateTagNameMutationOptions = Apollo.BaseMutationOptions<UpdateTagNameMutation, UpdateTagNameMutationVariables>;
export const UpdateTagColorDocument = gql`
    mutation updateTagColor($tagId: String!, $color: TagColor!) {
  updateTagColor(tagId: $tagId, color: $color) {
    id
    color
  }
}
    `;
export type UpdateTagColorMutationFn = Apollo.MutationFunction<UpdateTagColorMutation, UpdateTagColorMutationVariables>;

/**
 * __useUpdateTagColorMutation__
 *
 * To run a mutation, you first call `useUpdateTagColorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTagColorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTagColorMutation, { data, loading, error }] = useUpdateTagColorMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      color: // value for 'color'
 *   },
 * });
 */
export function useUpdateTagColorMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTagColorMutation, UpdateTagColorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTagColorMutation, UpdateTagColorMutationVariables>(UpdateTagColorDocument, options);
      }
export type UpdateTagColorMutationHookResult = ReturnType<typeof useUpdateTagColorMutation>;
export type UpdateTagColorMutationResult = Apollo.MutationResult<UpdateTagColorMutation>;
export type UpdateTagColorMutationOptions = Apollo.BaseMutationOptions<UpdateTagColorMutation, UpdateTagColorMutationVariables>;
export const UpdateTagEmojiDocument = gql`
    mutation updateTagEmoji($tagId: String!, $emoji: String!) {
  updateTagEmoji(tagId: $tagId, emoji: $emoji) {
    id
    emoji
  }
}
    `;
export type UpdateTagEmojiMutationFn = Apollo.MutationFunction<UpdateTagEmojiMutation, UpdateTagEmojiMutationVariables>;

/**
 * __useUpdateTagEmojiMutation__
 *
 * To run a mutation, you first call `useUpdateTagEmojiMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTagEmojiMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTagEmojiMutation, { data, loading, error }] = useUpdateTagEmojiMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      emoji: // value for 'emoji'
 *   },
 * });
 */
export function useUpdateTagEmojiMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTagEmojiMutation, UpdateTagEmojiMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTagEmojiMutation, UpdateTagEmojiMutationVariables>(UpdateTagEmojiDocument, options);
      }
export type UpdateTagEmojiMutationHookResult = ReturnType<typeof useUpdateTagEmojiMutation>;
export type UpdateTagEmojiMutationResult = Apollo.MutationResult<UpdateTagEmojiMutation>;
export type UpdateTagEmojiMutationOptions = Apollo.BaseMutationOptions<UpdateTagEmojiMutation, UpdateTagEmojiMutationVariables>;
export const WorkspaceTagDetailsDocument = gql`
    query workspaceTagDetails($id: String!) {
  workspace(id: $id) {
    tags {
      id
      name
      color
      emoji
      isDefault
    }
  }
  getTagHighlightCounts(workspaceId: $id) {
    tagId
    highlightCount
  }
  getTaglessHighlightCounts(workspaceId: $id)
}
    `;

/**
 * __useWorkspaceTagDetailsQuery__
 *
 * To run a query within a React component, call `useWorkspaceTagDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceTagDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceTagDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useWorkspaceTagDetailsQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceTagDetailsQuery, WorkspaceTagDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceTagDetailsQuery, WorkspaceTagDetailsQueryVariables>(WorkspaceTagDetailsDocument, options);
      }
export function useWorkspaceTagDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceTagDetailsQuery, WorkspaceTagDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceTagDetailsQuery, WorkspaceTagDetailsQueryVariables>(WorkspaceTagDetailsDocument, options);
        }
export type WorkspaceTagDetailsQueryHookResult = ReturnType<typeof useWorkspaceTagDetailsQuery>;
export type WorkspaceTagDetailsLazyQueryHookResult = ReturnType<typeof useWorkspaceTagDetailsLazyQuery>;
export type WorkspaceTagDetailsQueryResult = Apollo.QueryResult<WorkspaceTagDetailsQuery, WorkspaceTagDetailsQueryVariables>;