import * as Types from '../../../global/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateTagMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
  workspaceId: Types.Scalars['String'];
  color?: Types.InputMaybe<Types.TagColor>;
  projectId?: Types.InputMaybe<Types.Scalars['String']>;
  emoji: Types.Scalars['String'];
}>;


export type CreateTagMutation = { __typename?: 'Mutation', createTag: { __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string } };

export type GetHighlightQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GetHighlightQuery = { __typename?: 'Query', highlight: { __typename?: 'Highlight', id: string, highlightedRange: { __typename?: 'WordRange', text: string, startWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number }, endWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number } }, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string } | null> } };

export type AddHighlightToTranscriptMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
  startWord: Types.TranscriptWordInput;
  endWord: Types.TranscriptWordInput;
  tagIds?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type AddHighlightToTranscriptMutation = { __typename?: 'Mutation', addHighlight: { __typename?: 'Highlight', id: string, highlightedRange: { __typename?: 'WordRange', text: string, startWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number }, endWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number } } } };

export type InterviewWorkspaceQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type InterviewWorkspaceQuery = { __typename?: 'Query', interview: { __typename?: 'Interview', id: string, workspace: { __typename?: 'Workspace', id: string, tags?: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string } | null> | null } } };

export type AddTagsMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
  highlightId: Types.Scalars['String'];
  tagIds: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;


export type AddTagsMutation = { __typename?: 'Mutation', addTagsToHighlight: { __typename?: 'Highlight', id: string, tags: Array<{ __typename?: 'Tag', id: string, name: string, emoji: string, color: Types.TagColor } | null> } };

export type AddNewTagMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
  highlightId: Types.Scalars['String'];
  tagName: Types.Scalars['String'];
  tagEmoji: Types.Scalars['String'];
  tagColor: Types.TagColor;
}>;


export type AddNewTagMutation = { __typename?: 'Mutation', addNewTagToHighlight: { __typename?: 'Highlight', id: string, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string } | null> } };

export type RemoveTagsMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
  highlightId: Types.Scalars['String'];
  tagIds: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;


export type RemoveTagsMutation = { __typename?: 'Mutation', removeTagsFromHighlight: { __typename?: 'Highlight', id: string, tags: Array<{ __typename?: 'Tag', id: string, emoji: string, color: Types.TagColor, name: string } | null> } };

export type RemoveHighlightMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
  highlightId: Types.Scalars['String'];
}>;


export type RemoveHighlightMutation = { __typename?: 'Mutation', removeHighlight: { __typename?: 'Interview', id: string, highlights: Array<{ __typename?: 'Highlight', id: string, highlightedRange: { __typename?: 'WordRange', text: string, startWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number }, endWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number } } } | null> } };

export type HighlightsForTagQueryVariables = Types.Exact<{
  tagId: Types.Scalars['String'];
  projectId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type HighlightsForTagQuery = { __typename?: 'Query', getHighlightsForTag: Array<{ __typename?: 'Highlight', id: string, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string } | null>, video?: { __typename?: 'Video', id: string, url?: string | null, previewImageUrl?: string | null, previewGifUrl?: string | null } | null, interview: { __typename?: 'Interview', id: string, date: any, name: string }, transcript?: { __typename?: 'Transcript', id?: string | null, isPending?: boolean | null, groups?: Array<{ __typename?: 'TranscriptGroup', id: string, groupNumber: number, text: string, speaker: { __typename?: 'Participant', id: string, name: string } } | null> | null } | null } | null> };

export type HighlightsWithoutTagQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
  projectId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type HighlightsWithoutTagQuery = { __typename?: 'Query', getHighlightsWithoutTag: Array<{ __typename?: 'Highlight', id: string, tags: Array<{ __typename?: 'Tag', id: string, name: string, emoji: string } | null>, video?: { __typename?: 'Video', id: string, url?: string | null, previewImageUrl?: string | null, previewGifUrl?: string | null } | null, interview: { __typename?: 'Interview', id: string, date: any, name: string }, transcript?: { __typename?: 'Transcript', id?: string | null, isPending?: boolean | null, groups?: Array<{ __typename?: 'TranscriptGroup', id: string, groupNumber: number, text: string, speaker: { __typename?: 'Participant', id: string, name: string } } | null> | null } | null } | null> };

export type ApproveSuggestedHighlightMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
  suggestedHighlightId: Types.Scalars['String'];
}>;


export type ApproveSuggestedHighlightMutation = { __typename?: 'Mutation', approveSuggestedHighlight: { __typename?: 'Interview', id: string, highlights: Array<{ __typename?: 'Highlight', id: string, originSuggestionId?: string | null, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string } | null>, highlightedRange: { __typename?: 'WordRange', text: string, startWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number }, endWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number } } } | null>, suggestedHighlights: Array<{ __typename?: 'SuggestedHighlight', id: string, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string } | null>, highlightedRange: { __typename?: 'WordRange', text: string, startWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number }, endWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number } } } | null> } };

export type RejectSuggestedHighlightMutationVariables = Types.Exact<{
  interviewId: Types.Scalars['String'];
  suggestedHighlightId: Types.Scalars['String'];
}>;


export type RejectSuggestedHighlightMutation = { __typename?: 'Mutation', rejectSuggestedHighlight: { __typename?: 'Interview', id: string, suggestedHighlights: Array<{ __typename?: 'SuggestedHighlight', id: string, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: Types.TagColor, emoji: string } | null>, highlightedRange: { __typename?: 'WordRange', text: string, startWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number }, endWord: { __typename?: 'TranscriptWord', id: string, start: number, end: number, wordNumber: number, groupNumber: number } } } | null> } };


export const CreateTagDocument = gql`
    mutation createTag($name: String!, $workspaceId: String!, $color: TagColor, $projectId: String, $emoji: String!) {
  createTag(
    name: $name
    workspaceId: $workspaceId
    color: $color
    projectId: $projectId
    emoji: $emoji
  ) {
    id
    name
    color
    emoji
  }
}
    `;
export type CreateTagMutationFn = Apollo.MutationFunction<CreateTagMutation, CreateTagMutationVariables>;

/**
 * __useCreateTagMutation__
 *
 * To run a mutation, you first call `useCreateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTagMutation, { data, loading, error }] = useCreateTagMutation({
 *   variables: {
 *      name: // value for 'name'
 *      workspaceId: // value for 'workspaceId'
 *      color: // value for 'color'
 *      projectId: // value for 'projectId'
 *      emoji: // value for 'emoji'
 *   },
 * });
 */
export function useCreateTagMutation(baseOptions?: Apollo.MutationHookOptions<CreateTagMutation, CreateTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTagMutation, CreateTagMutationVariables>(CreateTagDocument, options);
      }
export type CreateTagMutationHookResult = ReturnType<typeof useCreateTagMutation>;
export type CreateTagMutationResult = Apollo.MutationResult<CreateTagMutation>;
export type CreateTagMutationOptions = Apollo.BaseMutationOptions<CreateTagMutation, CreateTagMutationVariables>;
export const GetHighlightDocument = gql`
    query getHighlight($id: String!) {
  highlight(id: $id) {
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
    tags {
      id
      name
      color
      emoji
    }
  }
}
    `;

/**
 * __useGetHighlightQuery__
 *
 * To run a query within a React component, call `useGetHighlightQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHighlightQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHighlightQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetHighlightQuery(baseOptions: Apollo.QueryHookOptions<GetHighlightQuery, GetHighlightQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetHighlightQuery, GetHighlightQueryVariables>(GetHighlightDocument, options);
      }
export function useGetHighlightLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetHighlightQuery, GetHighlightQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetHighlightQuery, GetHighlightQueryVariables>(GetHighlightDocument, options);
        }
export type GetHighlightQueryHookResult = ReturnType<typeof useGetHighlightQuery>;
export type GetHighlightLazyQueryHookResult = ReturnType<typeof useGetHighlightLazyQuery>;
export type GetHighlightQueryResult = Apollo.QueryResult<GetHighlightQuery, GetHighlightQueryVariables>;
export const AddHighlightToTranscriptDocument = gql`
    mutation addHighlightToTranscript($interviewId: String!, $startWord: TranscriptWordInput!, $endWord: TranscriptWordInput!, $tagIds: [String!]) {
  addHighlight(
    interviewId: $interviewId
    startWord: $startWord
    endWord: $endWord
    tagIds: $tagIds
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
export type AddHighlightToTranscriptMutationFn = Apollo.MutationFunction<AddHighlightToTranscriptMutation, AddHighlightToTranscriptMutationVariables>;

/**
 * __useAddHighlightToTranscriptMutation__
 *
 * To run a mutation, you first call `useAddHighlightToTranscriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddHighlightToTranscriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addHighlightToTranscriptMutation, { data, loading, error }] = useAddHighlightToTranscriptMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      startWord: // value for 'startWord'
 *      endWord: // value for 'endWord'
 *      tagIds: // value for 'tagIds'
 *   },
 * });
 */
export function useAddHighlightToTranscriptMutation(baseOptions?: Apollo.MutationHookOptions<AddHighlightToTranscriptMutation, AddHighlightToTranscriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddHighlightToTranscriptMutation, AddHighlightToTranscriptMutationVariables>(AddHighlightToTranscriptDocument, options);
      }
export type AddHighlightToTranscriptMutationHookResult = ReturnType<typeof useAddHighlightToTranscriptMutation>;
export type AddHighlightToTranscriptMutationResult = Apollo.MutationResult<AddHighlightToTranscriptMutation>;
export type AddHighlightToTranscriptMutationOptions = Apollo.BaseMutationOptions<AddHighlightToTranscriptMutation, AddHighlightToTranscriptMutationVariables>;
export const InterviewWorkspaceDocument = gql`
    query interviewWorkspace($id: String!) {
  interview(id: $id) {
    id
    workspace {
      id
      tags {
        id
        name
        color
        emoji
      }
    }
  }
}
    `;

/**
 * __useInterviewWorkspaceQuery__
 *
 * To run a query within a React component, call `useInterviewWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useInterviewWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInterviewWorkspaceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useInterviewWorkspaceQuery(baseOptions: Apollo.QueryHookOptions<InterviewWorkspaceQuery, InterviewWorkspaceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InterviewWorkspaceQuery, InterviewWorkspaceQueryVariables>(InterviewWorkspaceDocument, options);
      }
export function useInterviewWorkspaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InterviewWorkspaceQuery, InterviewWorkspaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InterviewWorkspaceQuery, InterviewWorkspaceQueryVariables>(InterviewWorkspaceDocument, options);
        }
export type InterviewWorkspaceQueryHookResult = ReturnType<typeof useInterviewWorkspaceQuery>;
export type InterviewWorkspaceLazyQueryHookResult = ReturnType<typeof useInterviewWorkspaceLazyQuery>;
export type InterviewWorkspaceQueryResult = Apollo.QueryResult<InterviewWorkspaceQuery, InterviewWorkspaceQueryVariables>;
export const AddTagsDocument = gql`
    mutation addTags($interviewId: String!, $highlightId: String!, $tagIds: [String!]!) {
  addTagsToHighlight(
    interviewId: $interviewId
    highlightId: $highlightId
    tagIds: $tagIds
  ) {
    id
    tags {
      id
      name
      emoji
      color
    }
  }
}
    `;
export type AddTagsMutationFn = Apollo.MutationFunction<AddTagsMutation, AddTagsMutationVariables>;

/**
 * __useAddTagsMutation__
 *
 * To run a mutation, you first call `useAddTagsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTagsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTagsMutation, { data, loading, error }] = useAddTagsMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      highlightId: // value for 'highlightId'
 *      tagIds: // value for 'tagIds'
 *   },
 * });
 */
export function useAddTagsMutation(baseOptions?: Apollo.MutationHookOptions<AddTagsMutation, AddTagsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddTagsMutation, AddTagsMutationVariables>(AddTagsDocument, options);
      }
export type AddTagsMutationHookResult = ReturnType<typeof useAddTagsMutation>;
export type AddTagsMutationResult = Apollo.MutationResult<AddTagsMutation>;
export type AddTagsMutationOptions = Apollo.BaseMutationOptions<AddTagsMutation, AddTagsMutationVariables>;
export const AddNewTagDocument = gql`
    mutation addNewTag($interviewId: String!, $highlightId: String!, $tagName: String!, $tagEmoji: String!, $tagColor: TagColor!) {
  addNewTagToHighlight(
    interviewId: $interviewId
    highlightId: $highlightId
    tagName: $tagName
    emoji: $tagEmoji
    color: $tagColor
  ) {
    id
    tags {
      id
      name
      color
      emoji
    }
  }
}
    `;
export type AddNewTagMutationFn = Apollo.MutationFunction<AddNewTagMutation, AddNewTagMutationVariables>;

/**
 * __useAddNewTagMutation__
 *
 * To run a mutation, you first call `useAddNewTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNewTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNewTagMutation, { data, loading, error }] = useAddNewTagMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      highlightId: // value for 'highlightId'
 *      tagName: // value for 'tagName'
 *      tagEmoji: // value for 'tagEmoji'
 *      tagColor: // value for 'tagColor'
 *   },
 * });
 */
export function useAddNewTagMutation(baseOptions?: Apollo.MutationHookOptions<AddNewTagMutation, AddNewTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddNewTagMutation, AddNewTagMutationVariables>(AddNewTagDocument, options);
      }
export type AddNewTagMutationHookResult = ReturnType<typeof useAddNewTagMutation>;
export type AddNewTagMutationResult = Apollo.MutationResult<AddNewTagMutation>;
export type AddNewTagMutationOptions = Apollo.BaseMutationOptions<AddNewTagMutation, AddNewTagMutationVariables>;
export const RemoveTagsDocument = gql`
    mutation removeTags($interviewId: String!, $highlightId: String!, $tagIds: [String!]!) {
  removeTagsFromHighlight(
    interviewId: $interviewId
    highlightId: $highlightId
    tagIds: $tagIds
  ) {
    id
    tags {
      id
      emoji
      color
      name
    }
  }
}
    `;
export type RemoveTagsMutationFn = Apollo.MutationFunction<RemoveTagsMutation, RemoveTagsMutationVariables>;

/**
 * __useRemoveTagsMutation__
 *
 * To run a mutation, you first call `useRemoveTagsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTagsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTagsMutation, { data, loading, error }] = useRemoveTagsMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      highlightId: // value for 'highlightId'
 *      tagIds: // value for 'tagIds'
 *   },
 * });
 */
export function useRemoveTagsMutation(baseOptions?: Apollo.MutationHookOptions<RemoveTagsMutation, RemoveTagsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveTagsMutation, RemoveTagsMutationVariables>(RemoveTagsDocument, options);
      }
export type RemoveTagsMutationHookResult = ReturnType<typeof useRemoveTagsMutation>;
export type RemoveTagsMutationResult = Apollo.MutationResult<RemoveTagsMutation>;
export type RemoveTagsMutationOptions = Apollo.BaseMutationOptions<RemoveTagsMutation, RemoveTagsMutationVariables>;
export const RemoveHighlightDocument = gql`
    mutation removeHighlight($interviewId: String!, $highlightId: String!) {
  removeHighlight(interviewId: $interviewId, highlightId: $highlightId) {
    id
    highlights {
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
}
    `;
export type RemoveHighlightMutationFn = Apollo.MutationFunction<RemoveHighlightMutation, RemoveHighlightMutationVariables>;

/**
 * __useRemoveHighlightMutation__
 *
 * To run a mutation, you first call `useRemoveHighlightMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveHighlightMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeHighlightMutation, { data, loading, error }] = useRemoveHighlightMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      highlightId: // value for 'highlightId'
 *   },
 * });
 */
export function useRemoveHighlightMutation(baseOptions?: Apollo.MutationHookOptions<RemoveHighlightMutation, RemoveHighlightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveHighlightMutation, RemoveHighlightMutationVariables>(RemoveHighlightDocument, options);
      }
export type RemoveHighlightMutationHookResult = ReturnType<typeof useRemoveHighlightMutation>;
export type RemoveHighlightMutationResult = Apollo.MutationResult<RemoveHighlightMutation>;
export type RemoveHighlightMutationOptions = Apollo.BaseMutationOptions<RemoveHighlightMutation, RemoveHighlightMutationVariables>;
export const HighlightsForTagDocument = gql`
    query highlightsForTag($tagId: String!, $projectId: String) {
  getHighlightsForTag(tagId: $tagId, projectId: $projectId) {
    id
    tags {
      id
      name
      color
      emoji
    }
    video {
      id
      url
      previewImageUrl
      previewGifUrl
    }
    interview {
      id
      date
      name
    }
    transcript {
      id
      isPending
      groups {
        id
        groupNumber
        text
        speaker {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useHighlightsForTagQuery__
 *
 * To run a query within a React component, call `useHighlightsForTagQuery` and pass it any options that fit your needs.
 * When your component renders, `useHighlightsForTagQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHighlightsForTagQuery({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useHighlightsForTagQuery(baseOptions: Apollo.QueryHookOptions<HighlightsForTagQuery, HighlightsForTagQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HighlightsForTagQuery, HighlightsForTagQueryVariables>(HighlightsForTagDocument, options);
      }
export function useHighlightsForTagLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HighlightsForTagQuery, HighlightsForTagQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HighlightsForTagQuery, HighlightsForTagQueryVariables>(HighlightsForTagDocument, options);
        }
export type HighlightsForTagQueryHookResult = ReturnType<typeof useHighlightsForTagQuery>;
export type HighlightsForTagLazyQueryHookResult = ReturnType<typeof useHighlightsForTagLazyQuery>;
export type HighlightsForTagQueryResult = Apollo.QueryResult<HighlightsForTagQuery, HighlightsForTagQueryVariables>;
export const HighlightsWithoutTagDocument = gql`
    query highlightsWithoutTag($workspaceId: String!, $projectId: String) {
  getHighlightsWithoutTag(workspaceId: $workspaceId, projectId: $projectId) {
    id
    tags {
      id
      name
      emoji
    }
    video {
      id
      url
      previewImageUrl
      previewGifUrl
    }
    interview {
      id
      date
      name
    }
    transcript {
      id
      isPending
      groups {
        id
        groupNumber
        text
        speaker {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useHighlightsWithoutTagQuery__
 *
 * To run a query within a React component, call `useHighlightsWithoutTagQuery` and pass it any options that fit your needs.
 * When your component renders, `useHighlightsWithoutTagQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHighlightsWithoutTagQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useHighlightsWithoutTagQuery(baseOptions: Apollo.QueryHookOptions<HighlightsWithoutTagQuery, HighlightsWithoutTagQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HighlightsWithoutTagQuery, HighlightsWithoutTagQueryVariables>(HighlightsWithoutTagDocument, options);
      }
export function useHighlightsWithoutTagLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HighlightsWithoutTagQuery, HighlightsWithoutTagQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HighlightsWithoutTagQuery, HighlightsWithoutTagQueryVariables>(HighlightsWithoutTagDocument, options);
        }
export type HighlightsWithoutTagQueryHookResult = ReturnType<typeof useHighlightsWithoutTagQuery>;
export type HighlightsWithoutTagLazyQueryHookResult = ReturnType<typeof useHighlightsWithoutTagLazyQuery>;
export type HighlightsWithoutTagQueryResult = Apollo.QueryResult<HighlightsWithoutTagQuery, HighlightsWithoutTagQueryVariables>;
export const ApproveSuggestedHighlightDocument = gql`
    mutation approveSuggestedHighlight($interviewId: String!, $suggestedHighlightId: String!) {
  approveSuggestedHighlight(
    interviewId: $interviewId
    suggestedHighlightId: $suggestedHighlightId
  ) {
    id
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
export type ApproveSuggestedHighlightMutationFn = Apollo.MutationFunction<ApproveSuggestedHighlightMutation, ApproveSuggestedHighlightMutationVariables>;

/**
 * __useApproveSuggestedHighlightMutation__
 *
 * To run a mutation, you first call `useApproveSuggestedHighlightMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveSuggestedHighlightMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveSuggestedHighlightMutation, { data, loading, error }] = useApproveSuggestedHighlightMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      suggestedHighlightId: // value for 'suggestedHighlightId'
 *   },
 * });
 */
export function useApproveSuggestedHighlightMutation(baseOptions?: Apollo.MutationHookOptions<ApproveSuggestedHighlightMutation, ApproveSuggestedHighlightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveSuggestedHighlightMutation, ApproveSuggestedHighlightMutationVariables>(ApproveSuggestedHighlightDocument, options);
      }
export type ApproveSuggestedHighlightMutationHookResult = ReturnType<typeof useApproveSuggestedHighlightMutation>;
export type ApproveSuggestedHighlightMutationResult = Apollo.MutationResult<ApproveSuggestedHighlightMutation>;
export type ApproveSuggestedHighlightMutationOptions = Apollo.BaseMutationOptions<ApproveSuggestedHighlightMutation, ApproveSuggestedHighlightMutationVariables>;
export const RejectSuggestedHighlightDocument = gql`
    mutation rejectSuggestedHighlight($interviewId: String!, $suggestedHighlightId: String!) {
  rejectSuggestedHighlight(
    interviewId: $interviewId
    suggestedHighlightId: $suggestedHighlightId
  ) {
    id
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
export type RejectSuggestedHighlightMutationFn = Apollo.MutationFunction<RejectSuggestedHighlightMutation, RejectSuggestedHighlightMutationVariables>;

/**
 * __useRejectSuggestedHighlightMutation__
 *
 * To run a mutation, you first call `useRejectSuggestedHighlightMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectSuggestedHighlightMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectSuggestedHighlightMutation, { data, loading, error }] = useRejectSuggestedHighlightMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      suggestedHighlightId: // value for 'suggestedHighlightId'
 *   },
 * });
 */
export function useRejectSuggestedHighlightMutation(baseOptions?: Apollo.MutationHookOptions<RejectSuggestedHighlightMutation, RejectSuggestedHighlightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectSuggestedHighlightMutation, RejectSuggestedHighlightMutationVariables>(RejectSuggestedHighlightDocument, options);
      }
export type RejectSuggestedHighlightMutationHookResult = ReturnType<typeof useRejectSuggestedHighlightMutation>;
export type RejectSuggestedHighlightMutationResult = Apollo.MutationResult<RejectSuggestedHighlightMutation>;
export type RejectSuggestedHighlightMutationOptions = Apollo.BaseMutationOptions<RejectSuggestedHighlightMutation, RejectSuggestedHighlightMutationVariables>;