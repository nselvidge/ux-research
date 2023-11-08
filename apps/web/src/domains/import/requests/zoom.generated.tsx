import * as Types from '../../../global/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type IsConnectedToZoomQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type IsConnectedToZoomQuery = { __typename?: 'Query', isConnectedToZoom: boolean };

export type GetZoomRecordingListQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetZoomRecordingListQuery = { __typename?: 'Query', zoomRecordingList?: { __typename?: 'VideoProviderRecordingList', totalCount: number, recordings?: Array<{ __typename?: 'VideoProviderRecording', externalId: string, label?: string | null, startTime: string } | null> | null } | null };

export type ImportInterviewFromZoomMutationVariables = Types.Exact<{
  externalId: Types.Scalars['String'];
  workspaceId: Types.Scalars['String'];
}>;


export type ImportInterviewFromZoomMutation = { __typename?: 'Mutation', importInterviewFromZoom?: { __typename?: 'Interview', id: string } | null };


export const IsConnectedToZoomDocument = gql`
    query isConnectedToZoom {
  isConnectedToZoom
}
    `;

/**
 * __useIsConnectedToZoomQuery__
 *
 * To run a query within a React component, call `useIsConnectedToZoomQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsConnectedToZoomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsConnectedToZoomQuery({
 *   variables: {
 *   },
 * });
 */
export function useIsConnectedToZoomQuery(baseOptions?: Apollo.QueryHookOptions<IsConnectedToZoomQuery, IsConnectedToZoomQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsConnectedToZoomQuery, IsConnectedToZoomQueryVariables>(IsConnectedToZoomDocument, options);
      }
export function useIsConnectedToZoomLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsConnectedToZoomQuery, IsConnectedToZoomQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsConnectedToZoomQuery, IsConnectedToZoomQueryVariables>(IsConnectedToZoomDocument, options);
        }
export type IsConnectedToZoomQueryHookResult = ReturnType<typeof useIsConnectedToZoomQuery>;
export type IsConnectedToZoomLazyQueryHookResult = ReturnType<typeof useIsConnectedToZoomLazyQuery>;
export type IsConnectedToZoomQueryResult = Apollo.QueryResult<IsConnectedToZoomQuery, IsConnectedToZoomQueryVariables>;
export const GetZoomRecordingListDocument = gql`
    query getZoomRecordingList {
  zoomRecordingList {
    totalCount
    recordings {
      externalId
      label
      startTime
    }
  }
}
    `;

/**
 * __useGetZoomRecordingListQuery__
 *
 * To run a query within a React component, call `useGetZoomRecordingListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetZoomRecordingListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetZoomRecordingListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetZoomRecordingListQuery(baseOptions?: Apollo.QueryHookOptions<GetZoomRecordingListQuery, GetZoomRecordingListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetZoomRecordingListQuery, GetZoomRecordingListQueryVariables>(GetZoomRecordingListDocument, options);
      }
export function useGetZoomRecordingListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetZoomRecordingListQuery, GetZoomRecordingListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetZoomRecordingListQuery, GetZoomRecordingListQueryVariables>(GetZoomRecordingListDocument, options);
        }
export type GetZoomRecordingListQueryHookResult = ReturnType<typeof useGetZoomRecordingListQuery>;
export type GetZoomRecordingListLazyQueryHookResult = ReturnType<typeof useGetZoomRecordingListLazyQuery>;
export type GetZoomRecordingListQueryResult = Apollo.QueryResult<GetZoomRecordingListQuery, GetZoomRecordingListQueryVariables>;
export const ImportInterviewFromZoomDocument = gql`
    mutation importInterviewFromZoom($externalId: String!, $workspaceId: String!) {
  importInterviewFromZoom(externalId: $externalId, workspaceId: $workspaceId) {
    id
  }
}
    `;
export type ImportInterviewFromZoomMutationFn = Apollo.MutationFunction<ImportInterviewFromZoomMutation, ImportInterviewFromZoomMutationVariables>;

/**
 * __useImportInterviewFromZoomMutation__
 *
 * To run a mutation, you first call `useImportInterviewFromZoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useImportInterviewFromZoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [importInterviewFromZoomMutation, { data, loading, error }] = useImportInterviewFromZoomMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useImportInterviewFromZoomMutation(baseOptions?: Apollo.MutationHookOptions<ImportInterviewFromZoomMutation, ImportInterviewFromZoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ImportInterviewFromZoomMutation, ImportInterviewFromZoomMutationVariables>(ImportInterviewFromZoomDocument, options);
      }
export type ImportInterviewFromZoomMutationHookResult = ReturnType<typeof useImportInterviewFromZoomMutation>;
export type ImportInterviewFromZoomMutationResult = Apollo.MutationResult<ImportInterviewFromZoomMutation>;
export type ImportInterviewFromZoomMutationOptions = Apollo.BaseMutationOptions<ImportInterviewFromZoomMutation, ImportInterviewFromZoomMutationVariables>;