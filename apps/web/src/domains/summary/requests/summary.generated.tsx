import * as Types from '../../../global/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type InterviewSummaryQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type InterviewSummaryQuery = { __typename?: 'Query', interview: { __typename?: 'Interview', id: string, name: string, date: any, currentUserCanEdit: boolean, summary?: { __typename?: 'InterviewSummary', id: string, text: string } | null, creator: { __typename?: 'InterviewCreator', id: string, fullName: string }, recording?: { __typename?: 'Video', id: string, url?: string | null, previewImageUrl?: string | null } | null, workspace: { __typename?: 'Workspace', id: string, name: string, tags?: Array<{ __typename?: 'Tag', isDefault: boolean, id: string, name: string, color: Types.TagColor } | null> | null }, highlights: Array<{ __typename?: 'Highlight', id: string, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor } | null>, video?: { __typename?: 'Video', id: string, url?: string | null, previewImageUrl?: string | null, previewGifUrl?: string | null } | null, interview: { __typename?: 'Interview', id: string, name: string, date: any }, transcript?: { __typename?: 'Transcript', id?: string | null, groups?: Array<{ __typename?: 'TranscriptGroup', id: string, text: string, speaker: { __typename?: 'Participant', id: string, name: string }, words: Array<{ __typename?: 'TranscriptWord', id: string, text: string, start: number, end: number }> } | null> | null } | null } | null> } };

export type UpdateSummaryMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
  text: Types.Scalars['String'];
}>;


export type UpdateSummaryMutation = { __typename?: 'Mutation', updateInterviewSummary: { __typename?: 'Interview', id: string, summary?: { __typename?: 'InterviewSummary', id: string, text: string } | null } };


export const InterviewSummaryDocument = gql`
    query interviewSummary($id: String!) {
  interview(id: $id) {
    id
    name
    date
    currentUserCanEdit
    summary {
      id
      text
    }
    creator {
      id
      fullName
    }
    recording {
      id
      url
      previewImageUrl
    }
    workspace {
      id
      name
      tags {
        isDefault
        id
        name
        color
      }
    }
    highlights {
      id
      tags {
        id
        name
        color
      }
      video {
        id
        url
        previewImageUrl
        previewGifUrl
      }
      interview {
        id
        name
        date
      }
      transcript {
        id
        groups {
          id
          text
          speaker {
            id
            name
          }
          words {
            id
            text
            start
            end
          }
        }
      }
    }
  }
}
    `;

/**
 * __useInterviewSummaryQuery__
 *
 * To run a query within a React component, call `useInterviewSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useInterviewSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInterviewSummaryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useInterviewSummaryQuery(baseOptions: Apollo.QueryHookOptions<InterviewSummaryQuery, InterviewSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InterviewSummaryQuery, InterviewSummaryQueryVariables>(InterviewSummaryDocument, options);
      }
export function useInterviewSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InterviewSummaryQuery, InterviewSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InterviewSummaryQuery, InterviewSummaryQueryVariables>(InterviewSummaryDocument, options);
        }
export type InterviewSummaryQueryHookResult = ReturnType<typeof useInterviewSummaryQuery>;
export type InterviewSummaryLazyQueryHookResult = ReturnType<typeof useInterviewSummaryLazyQuery>;
export type InterviewSummaryQueryResult = Apollo.QueryResult<InterviewSummaryQuery, InterviewSummaryQueryVariables>;
export const UpdateSummaryDocument = gql`
    mutation updateSummary($interviewId: String!, $text: String!) {
  updateInterviewSummary(interviewId: $interviewId, text: $text) {
    id
    summary {
      id
      text
    }
  }
}
    `;
export type UpdateSummaryMutationFn = Apollo.MutationFunction<UpdateSummaryMutation, UpdateSummaryMutationVariables>;

/**
 * __useUpdateSummaryMutation__
 *
 * To run a mutation, you first call `useUpdateSummaryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSummaryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSummaryMutation, { data, loading, error }] = useUpdateSummaryMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useUpdateSummaryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSummaryMutation, UpdateSummaryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSummaryMutation, UpdateSummaryMutationVariables>(UpdateSummaryDocument, options);
      }
export type UpdateSummaryMutationHookResult = ReturnType<typeof useUpdateSummaryMutation>;
export type UpdateSummaryMutationResult = Apollo.MutationResult<UpdateSummaryMutation>;
export type UpdateSummaryMutationOptions = Apollo.BaseMutationOptions<UpdateSummaryMutation, UpdateSummaryMutationVariables>;