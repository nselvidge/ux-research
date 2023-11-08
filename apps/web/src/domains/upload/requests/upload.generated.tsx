import * as Types from '../../../global/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateUploadUrlMutationVariables = Types.Exact<{
  workspaceId: Types.Scalars['String'];
  interviewName: Types.Scalars['String'];
  interviewDate: Types.Scalars['Date'];
}>;


export type CreateUploadUrlMutation = { __typename?: 'Mutation', createUploadUrl: { __typename?: 'UploadInterviewResponse', interviewId: string, uploadUrl: string } };


export const CreateUploadUrlDocument = gql`
    mutation createUploadUrl($workspaceId: String!, $interviewName: String!, $interviewDate: Date!) {
  createUploadUrl(
    workspaceId: $workspaceId
    interviewName: $interviewName
    interviewDate: $interviewDate
  ) {
    interviewId
    uploadUrl
  }
}
    `;
export type CreateUploadUrlMutationFn = Apollo.MutationFunction<CreateUploadUrlMutation, CreateUploadUrlMutationVariables>;

/**
 * __useCreateUploadUrlMutation__
 *
 * To run a mutation, you first call `useCreateUploadUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUploadUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUploadUrlMutation, { data, loading, error }] = useCreateUploadUrlMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      interviewName: // value for 'interviewName'
 *      interviewDate: // value for 'interviewDate'
 *   },
 * });
 */
export function useCreateUploadUrlMutation(baseOptions?: Apollo.MutationHookOptions<CreateUploadUrlMutation, CreateUploadUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUploadUrlMutation, CreateUploadUrlMutationVariables>(CreateUploadUrlDocument, options);
      }
export type CreateUploadUrlMutationHookResult = ReturnType<typeof useCreateUploadUrlMutation>;
export type CreateUploadUrlMutationResult = Apollo.MutationResult<CreateUploadUrlMutation>;
export type CreateUploadUrlMutationOptions = Apollo.BaseMutationOptions<CreateUploadUrlMutation, CreateUploadUrlMutationVariables>;