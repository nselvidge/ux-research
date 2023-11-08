import * as Types from '../../../global/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreatePendingInterviewMutationVariables = Types.Exact<{
  externalId: Types.Scalars['String'];
  workspaceId: Types.Scalars['String'];
  projectId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type CreatePendingInterviewMutation = { __typename?: 'Mutation', createPendingInterview: { __typename?: 'Interview', id: string, name: string, workspace: { __typename?: 'Workspace', id: string, tags?: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, isDefault: boolean, emoji: string } | null> | null }, pendingHighlights: Array<{ __typename?: 'PendingHighlight', id: string, timestamp: any, tags: Array<{ __typename?: 'Tag', id: string, isDefault: boolean, name: string, color: Types.TagColor, emoji: string } | null> } | null> } };

export type RecordInterviewMutationVariables = Types.Exact<{
  externalId: Types.Scalars['String'];
  workspaceId: Types.Scalars['String'];
  projectId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type RecordInterviewMutation = { __typename?: 'Mutation', recordInterview?: { __typename?: 'Interview', id: string, name: string, workspace: { __typename?: 'Workspace', id: string, tags?: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, isDefault: boolean, emoji: string } | null> | null }, pendingHighlights: Array<{ __typename?: 'PendingHighlight', id: string, timestamp: any, tags: Array<{ __typename?: 'Tag', id: string, name: string, isDefault: boolean, color: Types.TagColor, emoji: string } | null> } | null> } | null };

export type GetPendingInterviewQueryVariables = Types.Exact<{
  externalId: Types.Scalars['String'];
}>;


export type GetPendingInterviewQuery = { __typename?: 'Query', getPendingInterview?: { __typename?: 'Interview', id: string, name: string, projectId?: string | null, workspace: { __typename?: 'Workspace', id: string, tags?: Array<{ __typename?: 'Tag', id: string, name: string, isDefault: boolean, color: Types.TagColor, emoji: string } | null> | null, projects: Array<{ __typename?: 'Project', id: string, name: string, projectTags: Array<{ __typename?: 'ProjectTag', position: number, tag: { __typename?: 'Tag', id: string, name: string, color: Types.TagColor, isDefault: boolean, emoji: string } } | null> } | null> }, pendingHighlights: Array<{ __typename?: 'PendingHighlight', id: string, timestamp: any, tags: Array<{ __typename?: 'Tag', id: string, name: string, isDefault: boolean, color: Types.TagColor, emoji: string } | null> } | null> } | null };

export type GetPendingInterviewByRecordingTargetQueryVariables = Types.Exact<{
  externalId: Types.Scalars['String'];
}>;


export type GetPendingInterviewByRecordingTargetQuery = { __typename?: 'Query', recordingStatus?: Types.RecordingStatus | null, getPendingInterviewByRecordingTarget?: { __typename?: 'Interview', id: string, name: string, projectId?: string | null, workspace: { __typename?: 'Workspace', id: string, tags?: Array<{ __typename?: 'Tag', id: string, name: string, isDefault: boolean, color: Types.TagColor, emoji: string } | null> | null, projects: Array<{ __typename?: 'Project', id: string, name: string, projectTags: Array<{ __typename?: 'ProjectTag', position: number, tag: { __typename?: 'Tag', id: string, name: string, color: Types.TagColor, isDefault: boolean, emoji: string } } | null> } | null> }, pendingHighlights: Array<{ __typename?: 'PendingHighlight', id: string, timestamp: any, tags: Array<{ __typename?: 'Tag', id: string, name: string, isDefault: boolean, color: Types.TagColor, emoji: string } | null> } | null> } | null };

export type CreateTimestampHighlightMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
  timestamp: Types.Scalars['Date'];
  tagId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type CreateTimestampHighlightMutation = { __typename?: 'Mutation', createTimestampHighlight: { __typename?: 'Interview', id: string, workspace: { __typename?: 'Workspace', id: string, tags?: Array<{ __typename?: 'Tag', id: string, isDefault: boolean, name: string, color: Types.TagColor, emoji: string } | null> | null }, pendingHighlights: Array<{ __typename?: 'PendingHighlight', id: string, timestamp: any, tags: Array<{ __typename?: 'Tag', id: string, name: string, isDefault: boolean, color: Types.TagColor, emoji: string } | null> } | null> } };

export type UpdateUserTagOrderMutationVariables = Types.Exact<{
  tagIds: Array<Types.Scalars['String']> | Types.Scalars['String'];
  workspaceId: Types.Scalars['String'];
}>;


export type UpdateUserTagOrderMutation = { __typename?: 'Mutation', updateUserTagOrder: { __typename?: 'Workspace', id: string, tags?: Array<{ __typename?: 'Tag', isDefault: boolean, id: string, name: string, color: Types.TagColor, emoji: string } | null> | null } };

export type RemoveInterviewFromProjectMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
}>;


export type RemoveInterviewFromProjectMutation = { __typename?: 'Mutation', removeInterviewFromProject: { __typename?: 'Interview', id: string, name: string, projectId?: string | null, pendingHighlights: Array<{ __typename?: 'PendingHighlight', id: string, timestamp: any, tags: Array<{ __typename?: 'Tag', id: string, name: string, isDefault: boolean, color: Types.TagColor, emoji: string } | null> } | null> } };

export type StopRecordingMutationVariables = Types.Exact<{
  meetingId: Types.Scalars['String'];
}>;


export type StopRecordingMutation = { __typename?: 'Mutation', stopRecording: boolean };


export const CreatePendingInterviewDocument = gql`
    mutation createPendingInterview($externalId: String!, $workspaceId: String!, $projectId: String) {
  createPendingInterview(
    zoomId: $externalId
    workspaceId: $workspaceId
    projectId: $projectId
  ) {
    id
    name
    workspace {
      id
      tags {
        id
        name
        color
        isDefault
        emoji
      }
    }
    pendingHighlights {
      id
      timestamp
      tags {
        id
        isDefault
        name
        color
        emoji
      }
    }
  }
}
    `;
export type CreatePendingInterviewMutationFn = Apollo.MutationFunction<CreatePendingInterviewMutation, CreatePendingInterviewMutationVariables>;

/**
 * __useCreatePendingInterviewMutation__
 *
 * To run a mutation, you first call `useCreatePendingInterviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePendingInterviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPendingInterviewMutation, { data, loading, error }] = useCreatePendingInterviewMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      workspaceId: // value for 'workspaceId'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useCreatePendingInterviewMutation(baseOptions?: Apollo.MutationHookOptions<CreatePendingInterviewMutation, CreatePendingInterviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePendingInterviewMutation, CreatePendingInterviewMutationVariables>(CreatePendingInterviewDocument, options);
      }
export type CreatePendingInterviewMutationHookResult = ReturnType<typeof useCreatePendingInterviewMutation>;
export type CreatePendingInterviewMutationResult = Apollo.MutationResult<CreatePendingInterviewMutation>;
export type CreatePendingInterviewMutationOptions = Apollo.BaseMutationOptions<CreatePendingInterviewMutation, CreatePendingInterviewMutationVariables>;
export const RecordInterviewDocument = gql`
    mutation recordInterview($externalId: String!, $workspaceId: String!, $projectId: String) {
  recordInterview(
    zoomId: $externalId
    workspaceId: $workspaceId
    projectId: $projectId
  ) {
    id
    name
    workspace {
      id
      tags {
        id
        name
        color
        isDefault
        emoji
      }
    }
    pendingHighlights {
      id
      timestamp
      tags {
        id
        name
        isDefault
        color
        emoji
      }
    }
  }
}
    `;
export type RecordInterviewMutationFn = Apollo.MutationFunction<RecordInterviewMutation, RecordInterviewMutationVariables>;

/**
 * __useRecordInterviewMutation__
 *
 * To run a mutation, you first call `useRecordInterviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRecordInterviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [recordInterviewMutation, { data, loading, error }] = useRecordInterviewMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      workspaceId: // value for 'workspaceId'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useRecordInterviewMutation(baseOptions?: Apollo.MutationHookOptions<RecordInterviewMutation, RecordInterviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RecordInterviewMutation, RecordInterviewMutationVariables>(RecordInterviewDocument, options);
      }
export type RecordInterviewMutationHookResult = ReturnType<typeof useRecordInterviewMutation>;
export type RecordInterviewMutationResult = Apollo.MutationResult<RecordInterviewMutation>;
export type RecordInterviewMutationOptions = Apollo.BaseMutationOptions<RecordInterviewMutation, RecordInterviewMutationVariables>;
export const GetPendingInterviewDocument = gql`
    query getPendingInterview($externalId: String!) {
  getPendingInterview(externalId: $externalId) {
    id
    name
    projectId
    workspace {
      id
      tags {
        id
        name
        isDefault
        color
        emoji
      }
      projects {
        id
        name
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
    pendingHighlights {
      id
      timestamp
      tags {
        id
        name
        isDefault
        color
        emoji
      }
    }
  }
}
    `;

/**
 * __useGetPendingInterviewQuery__
 *
 * To run a query within a React component, call `useGetPendingInterviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPendingInterviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPendingInterviewQuery({
 *   variables: {
 *      externalId: // value for 'externalId'
 *   },
 * });
 */
export function useGetPendingInterviewQuery(baseOptions: Apollo.QueryHookOptions<GetPendingInterviewQuery, GetPendingInterviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPendingInterviewQuery, GetPendingInterviewQueryVariables>(GetPendingInterviewDocument, options);
      }
export function useGetPendingInterviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPendingInterviewQuery, GetPendingInterviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPendingInterviewQuery, GetPendingInterviewQueryVariables>(GetPendingInterviewDocument, options);
        }
export type GetPendingInterviewQueryHookResult = ReturnType<typeof useGetPendingInterviewQuery>;
export type GetPendingInterviewLazyQueryHookResult = ReturnType<typeof useGetPendingInterviewLazyQuery>;
export type GetPendingInterviewQueryResult = Apollo.QueryResult<GetPendingInterviewQuery, GetPendingInterviewQueryVariables>;
export const GetPendingInterviewByRecordingTargetDocument = gql`
    query getPendingInterviewByRecordingTarget($externalId: String!) {
  recordingStatus(meetingId: $externalId)
  getPendingInterviewByRecordingTarget(externalId: $externalId) {
    id
    name
    projectId
    workspace {
      id
      tags {
        id
        name
        isDefault
        color
        emoji
      }
      projects {
        id
        name
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
    pendingHighlights {
      id
      timestamp
      tags {
        id
        name
        isDefault
        color
        emoji
      }
    }
  }
}
    `;

/**
 * __useGetPendingInterviewByRecordingTargetQuery__
 *
 * To run a query within a React component, call `useGetPendingInterviewByRecordingTargetQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPendingInterviewByRecordingTargetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPendingInterviewByRecordingTargetQuery({
 *   variables: {
 *      externalId: // value for 'externalId'
 *   },
 * });
 */
export function useGetPendingInterviewByRecordingTargetQuery(baseOptions: Apollo.QueryHookOptions<GetPendingInterviewByRecordingTargetQuery, GetPendingInterviewByRecordingTargetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPendingInterviewByRecordingTargetQuery, GetPendingInterviewByRecordingTargetQueryVariables>(GetPendingInterviewByRecordingTargetDocument, options);
      }
export function useGetPendingInterviewByRecordingTargetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPendingInterviewByRecordingTargetQuery, GetPendingInterviewByRecordingTargetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPendingInterviewByRecordingTargetQuery, GetPendingInterviewByRecordingTargetQueryVariables>(GetPendingInterviewByRecordingTargetDocument, options);
        }
export type GetPendingInterviewByRecordingTargetQueryHookResult = ReturnType<typeof useGetPendingInterviewByRecordingTargetQuery>;
export type GetPendingInterviewByRecordingTargetLazyQueryHookResult = ReturnType<typeof useGetPendingInterviewByRecordingTargetLazyQuery>;
export type GetPendingInterviewByRecordingTargetQueryResult = Apollo.QueryResult<GetPendingInterviewByRecordingTargetQuery, GetPendingInterviewByRecordingTargetQueryVariables>;
export const CreateTimestampHighlightDocument = gql`
    mutation createTimestampHighlight($interviewId: String!, $timestamp: Date!, $tagId: String) {
  createTimestampHighlight(
    interviewId: $interviewId
    timestamp: $timestamp
    tagId: $tagId
  ) {
    id
    workspace {
      id
      tags {
        id
        isDefault
        name
        color
        emoji
      }
    }
    pendingHighlights {
      id
      timestamp
      tags {
        id
        name
        isDefault
        color
        emoji
      }
    }
  }
}
    `;
export type CreateTimestampHighlightMutationFn = Apollo.MutationFunction<CreateTimestampHighlightMutation, CreateTimestampHighlightMutationVariables>;

/**
 * __useCreateTimestampHighlightMutation__
 *
 * To run a mutation, you first call `useCreateTimestampHighlightMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTimestampHighlightMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTimestampHighlightMutation, { data, loading, error }] = useCreateTimestampHighlightMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      timestamp: // value for 'timestamp'
 *      tagId: // value for 'tagId'
 *   },
 * });
 */
export function useCreateTimestampHighlightMutation(baseOptions?: Apollo.MutationHookOptions<CreateTimestampHighlightMutation, CreateTimestampHighlightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTimestampHighlightMutation, CreateTimestampHighlightMutationVariables>(CreateTimestampHighlightDocument, options);
      }
export type CreateTimestampHighlightMutationHookResult = ReturnType<typeof useCreateTimestampHighlightMutation>;
export type CreateTimestampHighlightMutationResult = Apollo.MutationResult<CreateTimestampHighlightMutation>;
export type CreateTimestampHighlightMutationOptions = Apollo.BaseMutationOptions<CreateTimestampHighlightMutation, CreateTimestampHighlightMutationVariables>;
export const UpdateUserTagOrderDocument = gql`
    mutation updateUserTagOrder($tagIds: [String!]!, $workspaceId: String!) {
  updateUserTagOrder(tagIds: $tagIds, workspaceId: $workspaceId) {
    id
    tags {
      isDefault
      id
      name
      color
      emoji
    }
  }
}
    `;
export type UpdateUserTagOrderMutationFn = Apollo.MutationFunction<UpdateUserTagOrderMutation, UpdateUserTagOrderMutationVariables>;

/**
 * __useUpdateUserTagOrderMutation__
 *
 * To run a mutation, you first call `useUpdateUserTagOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserTagOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserTagOrderMutation, { data, loading, error }] = useUpdateUserTagOrderMutation({
 *   variables: {
 *      tagIds: // value for 'tagIds'
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useUpdateUserTagOrderMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserTagOrderMutation, UpdateUserTagOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserTagOrderMutation, UpdateUserTagOrderMutationVariables>(UpdateUserTagOrderDocument, options);
      }
export type UpdateUserTagOrderMutationHookResult = ReturnType<typeof useUpdateUserTagOrderMutation>;
export type UpdateUserTagOrderMutationResult = Apollo.MutationResult<UpdateUserTagOrderMutation>;
export type UpdateUserTagOrderMutationOptions = Apollo.BaseMutationOptions<UpdateUserTagOrderMutation, UpdateUserTagOrderMutationVariables>;
export const RemoveInterviewFromProjectDocument = gql`
    mutation removeInterviewFromProject($interviewId: String!) {
  removeInterviewFromProject(interviewId: $interviewId) {
    id
    name
    projectId
    pendingHighlights {
      id
      timestamp
      tags {
        id
        name
        isDefault
        color
        emoji
      }
    }
  }
}
    `;
export type RemoveInterviewFromProjectMutationFn = Apollo.MutationFunction<RemoveInterviewFromProjectMutation, RemoveInterviewFromProjectMutationVariables>;

/**
 * __useRemoveInterviewFromProjectMutation__
 *
 * To run a mutation, you first call `useRemoveInterviewFromProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveInterviewFromProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeInterviewFromProjectMutation, { data, loading, error }] = useRemoveInterviewFromProjectMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *   },
 * });
 */
export function useRemoveInterviewFromProjectMutation(baseOptions?: Apollo.MutationHookOptions<RemoveInterviewFromProjectMutation, RemoveInterviewFromProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveInterviewFromProjectMutation, RemoveInterviewFromProjectMutationVariables>(RemoveInterviewFromProjectDocument, options);
      }
export type RemoveInterviewFromProjectMutationHookResult = ReturnType<typeof useRemoveInterviewFromProjectMutation>;
export type RemoveInterviewFromProjectMutationResult = Apollo.MutationResult<RemoveInterviewFromProjectMutation>;
export type RemoveInterviewFromProjectMutationOptions = Apollo.BaseMutationOptions<RemoveInterviewFromProjectMutation, RemoveInterviewFromProjectMutationVariables>;
export const StopRecordingDocument = gql`
    mutation stopRecording($meetingId: String!) {
  stopRecording(meetingId: $meetingId)
}
    `;
export type StopRecordingMutationFn = Apollo.MutationFunction<StopRecordingMutation, StopRecordingMutationVariables>;

/**
 * __useStopRecordingMutation__
 *
 * To run a mutation, you first call `useStopRecordingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStopRecordingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stopRecordingMutation, { data, loading, error }] = useStopRecordingMutation({
 *   variables: {
 *      meetingId: // value for 'meetingId'
 *   },
 * });
 */
export function useStopRecordingMutation(baseOptions?: Apollo.MutationHookOptions<StopRecordingMutation, StopRecordingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StopRecordingMutation, StopRecordingMutationVariables>(StopRecordingDocument, options);
      }
export type StopRecordingMutationHookResult = ReturnType<typeof useStopRecordingMutation>;
export type StopRecordingMutationResult = Apollo.MutationResult<StopRecordingMutation>;
export type StopRecordingMutationOptions = Apollo.BaseMutationOptions<StopRecordingMutation, StopRecordingMutationVariables>;