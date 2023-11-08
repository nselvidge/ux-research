import * as Types from '../../../global/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ListInterviewsQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
  projectId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type ListInterviewsQuery = { __typename?: 'Query', listInterviews?: Array<{ __typename?: 'Interview', id: string, name: string, date: any, creator: { __typename?: 'InterviewCreator', id: string, fullName: string }, highlights: Array<{ __typename?: 'Highlight', id: string } | null>, pendingHighlights: Array<{ __typename?: 'PendingHighlight', id: string } | null>, recording?: { __typename?: 'Video', id: string, previewImageUrl?: string | null, previewGifUrl?: string | null } | null } | null> | null };

export type InterviewHighlightsQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type InterviewHighlightsQuery = { __typename?: 'Query', interview: { __typename?: 'Interview', id: string, currentUserCanEdit: boolean, highlights: Array<{ __typename?: 'Highlight', id: string, originSuggestionId?: string | null, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string } | null>, highlightedRange: { __typename?: 'WordRange', text: string, startWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number }, endWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number } } } | null>, suggestedHighlights: Array<{ __typename?: 'SuggestedHighlight', id: string, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string } | null>, highlightedRange: { __typename?: 'WordRange', text: string, startWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number }, endWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number } } } | null> } };

export type InterviewHighlightsWithTranscriptQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type InterviewHighlightsWithTranscriptQuery = { __typename?: 'Query', interview: { __typename?: 'Interview', id: string, currentUserCanEdit: boolean, transcript?: { __typename?: 'Transcript', id?: string | null, isPending?: boolean | null, groups?: Array<{ __typename?: 'TranscriptGroup', id: string, groupNumber: number, start: number, end: number, text: string, speaker: { __typename?: 'Participant', id: string, name: string }, words: Array<{ __typename?: 'TranscriptWord', id: string, wordNumber: number, groupNumber: number, start: number, end: number, text: string }> } | null> | null } | null, recording?: { __typename?: 'Video', id: string, url?: string | null } | null, highlights: Array<{ __typename?: 'Highlight', id: string, originSuggestionId?: string | null, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string } | null>, highlightedRange: { __typename?: 'WordRange', text: string, startWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number }, endWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number } } } | null> } };

export type InterviewQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type InterviewQuery = { __typename?: 'Query', interview: { __typename?: 'Interview', id: string, name: string, date: any, currentUserCanEdit: boolean, projectId?: string | null, workspace: { __typename?: 'Workspace', id: string, tags?: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, isDefault: boolean, emoji: string } | null> | null }, transcript?: { __typename?: 'Transcript', id?: string | null, isPending?: boolean | null, groups?: Array<{ __typename?: 'TranscriptGroup', id: string, groupNumber: number, start: number, end: number, text: string, speaker: { __typename?: 'Participant', id: string, name: string }, words: Array<{ __typename?: 'TranscriptWord', id: string, wordNumber: number, groupNumber: number, start: number, end: number, text: string }> } | null> | null } | null, recording?: { __typename?: 'Video', id: string, url?: string | null, previewImageUrl?: string | null } | null } };

export type UpdateInterviewNameMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  name: Types.Scalars['String'];
}>;


export type UpdateInterviewNameMutation = { __typename?: 'Mutation', updateInterviewName: { __typename?: 'Interview', id: string, name: string } };

export type ArchiveInterviewMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
}>;


export type ArchiveInterviewMutation = { __typename?: 'Mutation', archiveInterview: { __typename?: 'Interview', id: string } };

export type UpdateSpeakerNameMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
  speakerId: Types.Scalars['String'];
  newName: Types.Scalars['String'];
}>;


export type UpdateSpeakerNameMutation = { __typename?: 'Mutation', updateSpeakerName: { __typename?: 'Participant', id: string, name: string } };

export type UpdateHighlightMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
  highlightId: Types.Scalars['String'];
  startTime: Types.Scalars['Int'];
  endTime: Types.Scalars['Int'];
}>;


export type UpdateHighlightMutation = { __typename?: 'Mutation', updateHighlight: { __typename?: 'Highlight', id: string, highlightedRange: { __typename?: 'WordRange', text: string, startWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number }, endWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number } } } };

export type HighlightQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type HighlightQuery = { __typename?: 'Query', highlight: { __typename?: 'Highlight', id: string, interview: { __typename?: 'Interview', id: string, name: string, date: any, highlights: Array<{ __typename?: 'Highlight', id: string } | null> }, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string } | null>, transcript?: { __typename?: 'Transcript', id?: string | null, isPending?: boolean | null, groups?: Array<{ __typename?: 'TranscriptGroup', id: string, groupNumber: number, start: number, end: number, text: string, speaker: { __typename?: 'Participant', id: string, name: string }, words: Array<{ __typename?: 'TranscriptWord', id: string, wordNumber: number, groupNumber: number, start: number, end: number, text: string }> } | null> | null } | null, video?: { __typename?: 'Video', id: string, url?: string | null, previewImageUrl?: string | null } | null } };

export type MinimalInterviewQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type MinimalInterviewQuery = { __typename?: 'Query', interview: { __typename?: 'Interview', id: string, name: string } };


export const ListInterviewsDocument = gql`
    query listInterviews($workspaceId: String!, $projectId: String) {
  listInterviews(workspaceId: $workspaceId, projectId: $projectId) {
    id
    name
    date
    creator {
      id
      fullName
    }
    highlights {
      id
    }
    pendingHighlights {
      id
    }
    recording {
      id
      previewImageUrl
      previewGifUrl
    }
  }
}
    `;

/**
 * __useListInterviewsQuery__
 *
 * To run a query within a React component, call `useListInterviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListInterviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListInterviewsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useListInterviewsQuery(baseOptions: Apollo.QueryHookOptions<ListInterviewsQuery, ListInterviewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListInterviewsQuery, ListInterviewsQueryVariables>(ListInterviewsDocument, options);
      }
export function useListInterviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListInterviewsQuery, ListInterviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListInterviewsQuery, ListInterviewsQueryVariables>(ListInterviewsDocument, options);
        }
export type ListInterviewsQueryHookResult = ReturnType<typeof useListInterviewsQuery>;
export type ListInterviewsLazyQueryHookResult = ReturnType<typeof useListInterviewsLazyQuery>;
export type ListInterviewsQueryResult = Apollo.QueryResult<ListInterviewsQuery, ListInterviewsQueryVariables>;
export const InterviewHighlightsDocument = gql`
    query interviewHighlights($id: String!) {
  interview(id: $id) {
    id
    currentUserCanEdit
    highlights {
      id
      originSuggestionId
      tags {
        id
        name
        color
        emoji
      }
      highlightedRange {
        text
        startWord {
          id
          start
          end
          wordNumber
          groupNumber
        }
        endWord {
          id
          start
          end
          wordNumber
          groupNumber
        }
      }
    }
    suggestedHighlights {
      id
      tags {
        id
        name
        color
        emoji
      }
      highlightedRange {
        text
        startWord {
          id
          start
          end
          wordNumber
          groupNumber
        }
        endWord {
          id
          start
          end
          wordNumber
          groupNumber
        }
      }
    }
  }
}
    `;

/**
 * __useInterviewHighlightsQuery__
 *
 * To run a query within a React component, call `useInterviewHighlightsQuery` and pass it any options that fit your needs.
 * When your component renders, `useInterviewHighlightsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInterviewHighlightsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useInterviewHighlightsQuery(baseOptions: Apollo.QueryHookOptions<InterviewHighlightsQuery, InterviewHighlightsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InterviewHighlightsQuery, InterviewHighlightsQueryVariables>(InterviewHighlightsDocument, options);
      }
export function useInterviewHighlightsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InterviewHighlightsQuery, InterviewHighlightsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InterviewHighlightsQuery, InterviewHighlightsQueryVariables>(InterviewHighlightsDocument, options);
        }
export type InterviewHighlightsQueryHookResult = ReturnType<typeof useInterviewHighlightsQuery>;
export type InterviewHighlightsLazyQueryHookResult = ReturnType<typeof useInterviewHighlightsLazyQuery>;
export type InterviewHighlightsQueryResult = Apollo.QueryResult<InterviewHighlightsQuery, InterviewHighlightsQueryVariables>;
export const InterviewHighlightsWithTranscriptDocument = gql`
    query interviewHighlightsWithTranscript($id: String!) {
  interview(id: $id) {
    id
    currentUserCanEdit
    transcript {
      id
      isPending
      groups {
        id
        groupNumber
        start
        end
        text
        speaker {
          id
          name
        }
        words {
          id
          wordNumber
          groupNumber
          start
          end
          text
        }
      }
    }
    recording {
      id
      url
    }
    highlights {
      id
      originSuggestionId
      tags {
        id
        name
        color
        emoji
      }
      highlightedRange {
        text
        startWord {
          id
          start
          end
          wordNumber
          groupNumber
        }
        endWord {
          id
          start
          end
          wordNumber
          groupNumber
        }
      }
    }
  }
}
    `;

/**
 * __useInterviewHighlightsWithTranscriptQuery__
 *
 * To run a query within a React component, call `useInterviewHighlightsWithTranscriptQuery` and pass it any options that fit your needs.
 * When your component renders, `useInterviewHighlightsWithTranscriptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInterviewHighlightsWithTranscriptQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useInterviewHighlightsWithTranscriptQuery(baseOptions: Apollo.QueryHookOptions<InterviewHighlightsWithTranscriptQuery, InterviewHighlightsWithTranscriptQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InterviewHighlightsWithTranscriptQuery, InterviewHighlightsWithTranscriptQueryVariables>(InterviewHighlightsWithTranscriptDocument, options);
      }
export function useInterviewHighlightsWithTranscriptLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InterviewHighlightsWithTranscriptQuery, InterviewHighlightsWithTranscriptQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InterviewHighlightsWithTranscriptQuery, InterviewHighlightsWithTranscriptQueryVariables>(InterviewHighlightsWithTranscriptDocument, options);
        }
export type InterviewHighlightsWithTranscriptQueryHookResult = ReturnType<typeof useInterviewHighlightsWithTranscriptQuery>;
export type InterviewHighlightsWithTranscriptLazyQueryHookResult = ReturnType<typeof useInterviewHighlightsWithTranscriptLazyQuery>;
export type InterviewHighlightsWithTranscriptQueryResult = Apollo.QueryResult<InterviewHighlightsWithTranscriptQuery, InterviewHighlightsWithTranscriptQueryVariables>;
export const InterviewDocument = gql`
    query interview($id: String!) {
  interview(id: $id) {
    id
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
    name
    date
    currentUserCanEdit
    transcript {
      id
      isPending
      groups {
        id
        groupNumber
        start
        end
        text
        speaker {
          id
          name
        }
        words {
          id
          wordNumber
          groupNumber
          start
          end
          text
        }
      }
    }
    recording {
      id
      url
      previewImageUrl
    }
    projectId
  }
}
    `;

/**
 * __useInterviewQuery__
 *
 * To run a query within a React component, call `useInterviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useInterviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInterviewQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useInterviewQuery(baseOptions: Apollo.QueryHookOptions<InterviewQuery, InterviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InterviewQuery, InterviewQueryVariables>(InterviewDocument, options);
      }
export function useInterviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InterviewQuery, InterviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InterviewQuery, InterviewQueryVariables>(InterviewDocument, options);
        }
export type InterviewQueryHookResult = ReturnType<typeof useInterviewQuery>;
export type InterviewLazyQueryHookResult = ReturnType<typeof useInterviewLazyQuery>;
export type InterviewQueryResult = Apollo.QueryResult<InterviewQuery, InterviewQueryVariables>;
export const UpdateInterviewNameDocument = gql`
    mutation updateInterviewName($id: String!, $name: String!) {
  updateInterviewName(id: $id, name: $name) {
    id
    name
  }
}
    `;
export type UpdateInterviewNameMutationFn = Apollo.MutationFunction<UpdateInterviewNameMutation, UpdateInterviewNameMutationVariables>;

/**
 * __useUpdateInterviewNameMutation__
 *
 * To run a mutation, you first call `useUpdateInterviewNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInterviewNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInterviewNameMutation, { data, loading, error }] = useUpdateInterviewNameMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateInterviewNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInterviewNameMutation, UpdateInterviewNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInterviewNameMutation, UpdateInterviewNameMutationVariables>(UpdateInterviewNameDocument, options);
      }
export type UpdateInterviewNameMutationHookResult = ReturnType<typeof useUpdateInterviewNameMutation>;
export type UpdateInterviewNameMutationResult = Apollo.MutationResult<UpdateInterviewNameMutation>;
export type UpdateInterviewNameMutationOptions = Apollo.BaseMutationOptions<UpdateInterviewNameMutation, UpdateInterviewNameMutationVariables>;
export const ArchiveInterviewDocument = gql`
    mutation archiveInterview($interviewId: String!) {
  archiveInterview(interviewId: $interviewId) {
    id
  }
}
    `;
export type ArchiveInterviewMutationFn = Apollo.MutationFunction<ArchiveInterviewMutation, ArchiveInterviewMutationVariables>;

/**
 * __useArchiveInterviewMutation__
 *
 * To run a mutation, you first call `useArchiveInterviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveInterviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveInterviewMutation, { data, loading, error }] = useArchiveInterviewMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *   },
 * });
 */
export function useArchiveInterviewMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveInterviewMutation, ArchiveInterviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveInterviewMutation, ArchiveInterviewMutationVariables>(ArchiveInterviewDocument, options);
      }
export type ArchiveInterviewMutationHookResult = ReturnType<typeof useArchiveInterviewMutation>;
export type ArchiveInterviewMutationResult = Apollo.MutationResult<ArchiveInterviewMutation>;
export type ArchiveInterviewMutationOptions = Apollo.BaseMutationOptions<ArchiveInterviewMutation, ArchiveInterviewMutationVariables>;
export const UpdateSpeakerNameDocument = gql`
    mutation updateSpeakerName($interviewId: String!, $speakerId: String!, $newName: String!) {
  updateSpeakerName(
    interviewId: $interviewId
    speakerId: $speakerId
    newName: $newName
  ) {
    id
    name
  }
}
    `;
export type UpdateSpeakerNameMutationFn = Apollo.MutationFunction<UpdateSpeakerNameMutation, UpdateSpeakerNameMutationVariables>;

/**
 * __useUpdateSpeakerNameMutation__
 *
 * To run a mutation, you first call `useUpdateSpeakerNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSpeakerNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSpeakerNameMutation, { data, loading, error }] = useUpdateSpeakerNameMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      speakerId: // value for 'speakerId'
 *      newName: // value for 'newName'
 *   },
 * });
 */
export function useUpdateSpeakerNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSpeakerNameMutation, UpdateSpeakerNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSpeakerNameMutation, UpdateSpeakerNameMutationVariables>(UpdateSpeakerNameDocument, options);
      }
export type UpdateSpeakerNameMutationHookResult = ReturnType<typeof useUpdateSpeakerNameMutation>;
export type UpdateSpeakerNameMutationResult = Apollo.MutationResult<UpdateSpeakerNameMutation>;
export type UpdateSpeakerNameMutationOptions = Apollo.BaseMutationOptions<UpdateSpeakerNameMutation, UpdateSpeakerNameMutationVariables>;
export const UpdateHighlightDocument = gql`
    mutation updateHighlight($interviewId: String!, $highlightId: String!, $startTime: Int!, $endTime: Int!) {
  updateHighlight(
    interviewId: $interviewId
    highlightId: $highlightId
    startTime: $startTime
    endTime: $endTime
  ) {
    id
    highlightedRange {
      text
      startWord {
        id
        start
        end
        wordNumber
        groupNumber
      }
      endWord {
        id
        start
        end
        wordNumber
        groupNumber
      }
    }
  }
}
    `;
export type UpdateHighlightMutationFn = Apollo.MutationFunction<UpdateHighlightMutation, UpdateHighlightMutationVariables>;

/**
 * __useUpdateHighlightMutation__
 *
 * To run a mutation, you first call `useUpdateHighlightMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateHighlightMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateHighlightMutation, { data, loading, error }] = useUpdateHighlightMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      highlightId: // value for 'highlightId'
 *      startTime: // value for 'startTime'
 *      endTime: // value for 'endTime'
 *   },
 * });
 */
export function useUpdateHighlightMutation(baseOptions?: Apollo.MutationHookOptions<UpdateHighlightMutation, UpdateHighlightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateHighlightMutation, UpdateHighlightMutationVariables>(UpdateHighlightDocument, options);
      }
export type UpdateHighlightMutationHookResult = ReturnType<typeof useUpdateHighlightMutation>;
export type UpdateHighlightMutationResult = Apollo.MutationResult<UpdateHighlightMutation>;
export type UpdateHighlightMutationOptions = Apollo.BaseMutationOptions<UpdateHighlightMutation, UpdateHighlightMutationVariables>;
export const HighlightDocument = gql`
    query highlight($id: String!) {
  highlight(id: $id) {
    id
    interview {
      id
      name
      date
      highlights {
        id
      }
    }
    tags {
      id
      name
      color
      emoji
    }
    transcript {
      id
      isPending
      groups {
        id
        groupNumber
        start
        end
        text
        speaker {
          id
          name
        }
        words {
          id
          wordNumber
          groupNumber
          start
          end
          text
        }
      }
    }
    video {
      id
      url
      previewImageUrl
    }
  }
}
    `;

/**
 * __useHighlightQuery__
 *
 * To run a query within a React component, call `useHighlightQuery` and pass it any options that fit your needs.
 * When your component renders, `useHighlightQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHighlightQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useHighlightQuery(baseOptions: Apollo.QueryHookOptions<HighlightQuery, HighlightQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HighlightQuery, HighlightQueryVariables>(HighlightDocument, options);
      }
export function useHighlightLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HighlightQuery, HighlightQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HighlightQuery, HighlightQueryVariables>(HighlightDocument, options);
        }
export type HighlightQueryHookResult = ReturnType<typeof useHighlightQuery>;
export type HighlightLazyQueryHookResult = ReturnType<typeof useHighlightLazyQuery>;
export type HighlightQueryResult = Apollo.QueryResult<HighlightQuery, HighlightQueryVariables>;
export const MinimalInterviewDocument = gql`
    query minimalInterview($id: String!) {
  interview(id: $id) {
    id
    name
  }
}
    `;

/**
 * __useMinimalInterviewQuery__
 *
 * To run a query within a React component, call `useMinimalInterviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useMinimalInterviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMinimalInterviewQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMinimalInterviewQuery(baseOptions: Apollo.QueryHookOptions<MinimalInterviewQuery, MinimalInterviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MinimalInterviewQuery, MinimalInterviewQueryVariables>(MinimalInterviewDocument, options);
      }
export function useMinimalInterviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MinimalInterviewQuery, MinimalInterviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MinimalInterviewQuery, MinimalInterviewQueryVariables>(MinimalInterviewDocument, options);
        }
export type MinimalInterviewQueryHookResult = ReturnType<typeof useMinimalInterviewQuery>;
export type MinimalInterviewLazyQueryHookResult = ReturnType<typeof useMinimalInterviewLazyQuery>;
export type MinimalInterviewQueryResult = Apollo.QueryResult<MinimalInterviewQuery, MinimalInterviewQueryVariables>;