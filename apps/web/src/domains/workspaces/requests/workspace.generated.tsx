import * as Types from '../../../global/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type WorkspaceQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type WorkspaceQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, name: string, currentUserInviteToken?: string | null, publicInterviewLinks: boolean, pendingInvites: Array<{ __typename?: 'PendingInvite', id: string, email: string, role: Types.RoleType } | null>, tags?: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, isDefault: boolean, emoji: string } | null> | null, roles: Array<{ __typename?: 'WorkspaceRole', type: Types.RoleType, user: { __typename?: 'User', id: string, fullName: string, email: string } }> } | null };

export type TagHighlightCountsQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
}>;


export type TagHighlightCountsQuery = { __typename?: 'Query', getTagHighlightCounts: Array<{ __typename?: 'TagHighlightCounts', tagId: string, highlightCount: number } | null> };

export type CreateInviteTokenMutationVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
}>;


export type CreateInviteTokenMutation = { __typename?: 'Mutation', createInviteToken: string };

export type UpdateWorkspaceNameMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  name: Types.Scalars['String'];
}>;


export type UpdateWorkspaceNameMutation = { __typename?: 'Mutation', updateWorkspaceName: { __typename?: 'Workspace', id: string, name: string } };

export type SearchUsersQueryVariables = Types.Exact<{
  emailQuery: Types.Scalars['String'];
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsersByEmail?: Array<{ __typename?: 'User', id: string, fullName: string, email: string } | null> | null };

export type AddMemberToWorkspaceMutationVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
  memberId: Types.Scalars['String'];
}>;


export type AddMemberToWorkspaceMutation = { __typename?: 'Mutation', addMemberToWorkspace: { __typename?: 'Workspace', id: string, roles: Array<{ __typename?: 'WorkspaceRole', type: Types.RoleType, user: { __typename?: 'User', id: string, fullName: string, email: string } }> } };

export type UpdatePublicInterviewLinksMutationVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
  publicInterviewLinks: Types.Scalars['Boolean'];
}>;


export type UpdatePublicInterviewLinksMutation = { __typename?: 'Mutation', updatePublicInterviewLinks: { __typename?: 'Workspace', id: string, publicInterviewLinks: boolean } };

export type WorkspaceWithProjectsQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
}>;


export type WorkspaceWithProjectsQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, name: string, tags?: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, isDefault: boolean, emoji: string } | null> | null, projects: Array<{ __typename?: 'Project', id: string, name: string, description: string, projectTags: Array<{ __typename?: 'ProjectTag', position: number, tag: { __typename?: 'Tag', id: string, name: string, color: Types.TagColor, isDefault: boolean, emoji: string } } | null> } | null> } | null };

export type SendInviteEmailMutationVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
  email: Types.Scalars['String'];
}>;


export type SendInviteEmailMutation = { __typename?: 'Mutation', sendInviteEmail: { __typename?: 'Workspace', id: string, pendingInvites: Array<{ __typename?: 'PendingInvite', id: string, email: string, role: Types.RoleType } | null>, roles: Array<{ __typename?: 'WorkspaceRole', type: Types.RoleType, user: { __typename?: 'User', id: string, fullName: string, email: string } }> } };

export type AcceptInviteMutationVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
}>;


export type AcceptInviteMutation = { __typename?: 'Mutation', acceptInvite: { __typename?: 'User', id: string, pendingWorkspaceInvites: Array<{ __typename?: 'WorkspaceInvite', workspaceName: string, workspaceId: string, inviterName: string } | null> } };

export type RejectInviteMutationVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
}>;


export type RejectInviteMutation = { __typename?: 'Mutation', rejectInvite: { __typename?: 'User', id: string, pendingWorkspaceInvites: Array<{ __typename?: 'WorkspaceInvite', workspaceName: string, workspaceId: string, inviterName: string } | null> } };


export const WorkspaceDocument = gql`
    query workspace($id: String!) {
  workspace(id: $id) {
    id
    name
    currentUserInviteToken
    publicInterviewLinks
    pendingInvites {
      id
      email
      role
    }
    tags {
      id
      name
      color
      isDefault
      emoji
    }
    roles {
      type
      user {
        id
        fullName
        email
      }
    }
  }
}
    `;

/**
 * __useWorkspaceQuery__
 *
 * To run a query within a React component, call `useWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useWorkspaceQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceQuery, WorkspaceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceQuery, WorkspaceQueryVariables>(WorkspaceDocument, options);
      }
export function useWorkspaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceQuery, WorkspaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceQuery, WorkspaceQueryVariables>(WorkspaceDocument, options);
        }
export type WorkspaceQueryHookResult = ReturnType<typeof useWorkspaceQuery>;
export type WorkspaceLazyQueryHookResult = ReturnType<typeof useWorkspaceLazyQuery>;
export type WorkspaceQueryResult = Apollo.QueryResult<WorkspaceQuery, WorkspaceQueryVariables>;
export const TagHighlightCountsDocument = gql`
    query tagHighlightCounts($workspaceId: String!) {
  getTagHighlightCounts(workspaceId: $workspaceId) {
    tagId
    highlightCount
  }
}
    `;

/**
 * __useTagHighlightCountsQuery__
 *
 * To run a query within a React component, call `useTagHighlightCountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagHighlightCountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagHighlightCountsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useTagHighlightCountsQuery(baseOptions: Apollo.QueryHookOptions<TagHighlightCountsQuery, TagHighlightCountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TagHighlightCountsQuery, TagHighlightCountsQueryVariables>(TagHighlightCountsDocument, options);
      }
export function useTagHighlightCountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TagHighlightCountsQuery, TagHighlightCountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TagHighlightCountsQuery, TagHighlightCountsQueryVariables>(TagHighlightCountsDocument, options);
        }
export type TagHighlightCountsQueryHookResult = ReturnType<typeof useTagHighlightCountsQuery>;
export type TagHighlightCountsLazyQueryHookResult = ReturnType<typeof useTagHighlightCountsLazyQuery>;
export type TagHighlightCountsQueryResult = Apollo.QueryResult<TagHighlightCountsQuery, TagHighlightCountsQueryVariables>;
export const CreateInviteTokenDocument = gql`
    mutation createInviteToken($workspaceId: String!) {
  createInviteToken(workspaceId: $workspaceId)
}
    `;
export type CreateInviteTokenMutationFn = Apollo.MutationFunction<CreateInviteTokenMutation, CreateInviteTokenMutationVariables>;

/**
 * __useCreateInviteTokenMutation__
 *
 * To run a mutation, you first call `useCreateInviteTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInviteTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInviteTokenMutation, { data, loading, error }] = useCreateInviteTokenMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useCreateInviteTokenMutation(baseOptions?: Apollo.MutationHookOptions<CreateInviteTokenMutation, CreateInviteTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInviteTokenMutation, CreateInviteTokenMutationVariables>(CreateInviteTokenDocument, options);
      }
export type CreateInviteTokenMutationHookResult = ReturnType<typeof useCreateInviteTokenMutation>;
export type CreateInviteTokenMutationResult = Apollo.MutationResult<CreateInviteTokenMutation>;
export type CreateInviteTokenMutationOptions = Apollo.BaseMutationOptions<CreateInviteTokenMutation, CreateInviteTokenMutationVariables>;
export const UpdateWorkspaceNameDocument = gql`
    mutation updateWorkspaceName($id: String!, $name: String!) {
  updateWorkspaceName(id: $id, name: $name) {
    id
    name
  }
}
    `;
export type UpdateWorkspaceNameMutationFn = Apollo.MutationFunction<UpdateWorkspaceNameMutation, UpdateWorkspaceNameMutationVariables>;

/**
 * __useUpdateWorkspaceNameMutation__
 *
 * To run a mutation, you first call `useUpdateWorkspaceNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWorkspaceNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWorkspaceNameMutation, { data, loading, error }] = useUpdateWorkspaceNameMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateWorkspaceNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWorkspaceNameMutation, UpdateWorkspaceNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWorkspaceNameMutation, UpdateWorkspaceNameMutationVariables>(UpdateWorkspaceNameDocument, options);
      }
export type UpdateWorkspaceNameMutationHookResult = ReturnType<typeof useUpdateWorkspaceNameMutation>;
export type UpdateWorkspaceNameMutationResult = Apollo.MutationResult<UpdateWorkspaceNameMutation>;
export type UpdateWorkspaceNameMutationOptions = Apollo.BaseMutationOptions<UpdateWorkspaceNameMutation, UpdateWorkspaceNameMutationVariables>;
export const SearchUsersDocument = gql`
    query searchUsers($emailQuery: String!) {
  searchUsersByEmail(emailQuery: $emailQuery) {
    id
    fullName
    email
  }
}
    `;

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      emailQuery: // value for 'emailQuery'
 *   },
 * });
 */
export function useSearchUsersQuery(baseOptions: Apollo.QueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
      }
export function useSearchUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export type SearchUsersLazyQueryHookResult = ReturnType<typeof useSearchUsersLazyQuery>;
export type SearchUsersQueryResult = Apollo.QueryResult<SearchUsersQuery, SearchUsersQueryVariables>;
export const AddMemberToWorkspaceDocument = gql`
    mutation addMemberToWorkspace($workspaceId: String!, $memberId: String!) {
  addMemberToWorkspace(workspaceId: $workspaceId, memberId: $memberId) {
    id
    roles {
      type
      user {
        id
        fullName
        email
      }
    }
  }
}
    `;
export type AddMemberToWorkspaceMutationFn = Apollo.MutationFunction<AddMemberToWorkspaceMutation, AddMemberToWorkspaceMutationVariables>;

/**
 * __useAddMemberToWorkspaceMutation__
 *
 * To run a mutation, you first call `useAddMemberToWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMemberToWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMemberToWorkspaceMutation, { data, loading, error }] = useAddMemberToWorkspaceMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useAddMemberToWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<AddMemberToWorkspaceMutation, AddMemberToWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMemberToWorkspaceMutation, AddMemberToWorkspaceMutationVariables>(AddMemberToWorkspaceDocument, options);
      }
export type AddMemberToWorkspaceMutationHookResult = ReturnType<typeof useAddMemberToWorkspaceMutation>;
export type AddMemberToWorkspaceMutationResult = Apollo.MutationResult<AddMemberToWorkspaceMutation>;
export type AddMemberToWorkspaceMutationOptions = Apollo.BaseMutationOptions<AddMemberToWorkspaceMutation, AddMemberToWorkspaceMutationVariables>;
export const UpdatePublicInterviewLinksDocument = gql`
    mutation updatePublicInterviewLinks($workspaceId: String!, $publicInterviewLinks: Boolean!) {
  updatePublicInterviewLinks(
    workspaceId: $workspaceId
    publicInterviewLinks: $publicInterviewLinks
  ) {
    id
    publicInterviewLinks
  }
}
    `;
export type UpdatePublicInterviewLinksMutationFn = Apollo.MutationFunction<UpdatePublicInterviewLinksMutation, UpdatePublicInterviewLinksMutationVariables>;

/**
 * __useUpdatePublicInterviewLinksMutation__
 *
 * To run a mutation, you first call `useUpdatePublicInterviewLinksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePublicInterviewLinksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePublicInterviewLinksMutation, { data, loading, error }] = useUpdatePublicInterviewLinksMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      publicInterviewLinks: // value for 'publicInterviewLinks'
 *   },
 * });
 */
export function useUpdatePublicInterviewLinksMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePublicInterviewLinksMutation, UpdatePublicInterviewLinksMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePublicInterviewLinksMutation, UpdatePublicInterviewLinksMutationVariables>(UpdatePublicInterviewLinksDocument, options);
      }
export type UpdatePublicInterviewLinksMutationHookResult = ReturnType<typeof useUpdatePublicInterviewLinksMutation>;
export type UpdatePublicInterviewLinksMutationResult = Apollo.MutationResult<UpdatePublicInterviewLinksMutation>;
export type UpdatePublicInterviewLinksMutationOptions = Apollo.BaseMutationOptions<UpdatePublicInterviewLinksMutation, UpdatePublicInterviewLinksMutationVariables>;
export const WorkspaceWithProjectsDocument = gql`
    query workspaceWithProjects($workspaceId: String!) {
  workspace(id: $workspaceId) {
    id
    name
    tags {
      id
      name
      color
      isDefault
      emoji
    }
    projects {
      id
      name
      description
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
}
    `;

/**
 * __useWorkspaceWithProjectsQuery__
 *
 * To run a query within a React component, call `useWorkspaceWithProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceWithProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceWithProjectsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useWorkspaceWithProjectsQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceWithProjectsQuery, WorkspaceWithProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceWithProjectsQuery, WorkspaceWithProjectsQueryVariables>(WorkspaceWithProjectsDocument, options);
      }
export function useWorkspaceWithProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceWithProjectsQuery, WorkspaceWithProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceWithProjectsQuery, WorkspaceWithProjectsQueryVariables>(WorkspaceWithProjectsDocument, options);
        }
export type WorkspaceWithProjectsQueryHookResult = ReturnType<typeof useWorkspaceWithProjectsQuery>;
export type WorkspaceWithProjectsLazyQueryHookResult = ReturnType<typeof useWorkspaceWithProjectsLazyQuery>;
export type WorkspaceWithProjectsQueryResult = Apollo.QueryResult<WorkspaceWithProjectsQuery, WorkspaceWithProjectsQueryVariables>;
export const SendInviteEmailDocument = gql`
    mutation sendInviteEmail($workspaceId: String!, $email: String!) {
  sendInviteEmail(workspaceId: $workspaceId, email: $email) {
    id
    pendingInvites {
      id
      email
      role
    }
    roles {
      type
      user {
        id
        fullName
        email
      }
    }
  }
}
    `;
export type SendInviteEmailMutationFn = Apollo.MutationFunction<SendInviteEmailMutation, SendInviteEmailMutationVariables>;

/**
 * __useSendInviteEmailMutation__
 *
 * To run a mutation, you first call `useSendInviteEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendInviteEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendInviteEmailMutation, { data, loading, error }] = useSendInviteEmailMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSendInviteEmailMutation(baseOptions?: Apollo.MutationHookOptions<SendInviteEmailMutation, SendInviteEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendInviteEmailMutation, SendInviteEmailMutationVariables>(SendInviteEmailDocument, options);
      }
export type SendInviteEmailMutationHookResult = ReturnType<typeof useSendInviteEmailMutation>;
export type SendInviteEmailMutationResult = Apollo.MutationResult<SendInviteEmailMutation>;
export type SendInviteEmailMutationOptions = Apollo.BaseMutationOptions<SendInviteEmailMutation, SendInviteEmailMutationVariables>;
export const AcceptInviteDocument = gql`
    mutation acceptInvite($workspaceId: String!) {
  acceptInvite(workspaceId: $workspaceId) {
    id
    pendingWorkspaceInvites {
      workspaceName
      workspaceId
      inviterName
    }
  }
}
    `;
export type AcceptInviteMutationFn = Apollo.MutationFunction<AcceptInviteMutation, AcceptInviteMutationVariables>;

/**
 * __useAcceptInviteMutation__
 *
 * To run a mutation, you first call `useAcceptInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptInviteMutation, { data, loading, error }] = useAcceptInviteMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useAcceptInviteMutation(baseOptions?: Apollo.MutationHookOptions<AcceptInviteMutation, AcceptInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptInviteMutation, AcceptInviteMutationVariables>(AcceptInviteDocument, options);
      }
export type AcceptInviteMutationHookResult = ReturnType<typeof useAcceptInviteMutation>;
export type AcceptInviteMutationResult = Apollo.MutationResult<AcceptInviteMutation>;
export type AcceptInviteMutationOptions = Apollo.BaseMutationOptions<AcceptInviteMutation, AcceptInviteMutationVariables>;
export const RejectInviteDocument = gql`
    mutation rejectInvite($workspaceId: String!) {
  rejectInvite(workspaceId: $workspaceId) {
    id
    pendingWorkspaceInvites {
      workspaceName
      workspaceId
      inviterName
    }
  }
}
    `;
export type RejectInviteMutationFn = Apollo.MutationFunction<RejectInviteMutation, RejectInviteMutationVariables>;

/**
 * __useRejectInviteMutation__
 *
 * To run a mutation, you first call `useRejectInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectInviteMutation, { data, loading, error }] = useRejectInviteMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useRejectInviteMutation(baseOptions?: Apollo.MutationHookOptions<RejectInviteMutation, RejectInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectInviteMutation, RejectInviteMutationVariables>(RejectInviteDocument, options);
      }
export type RejectInviteMutationHookResult = ReturnType<typeof useRejectInviteMutation>;
export type RejectInviteMutationResult = Apollo.MutationResult<RejectInviteMutation>;
export type RejectInviteMutationOptions = Apollo.BaseMutationOptions<RejectInviteMutation, RejectInviteMutationVariables>;