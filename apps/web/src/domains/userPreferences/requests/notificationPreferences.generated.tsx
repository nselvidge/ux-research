import * as Types from '../../../global/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NotificationPreferencesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NotificationPreferencesQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, notificationPreferences?: { __typename?: 'NotificationPreferences', id: string, notificationEmails: boolean } | null } | null };

export type UpdateEmailPreferencesMutationVariables = Types.Exact<{
  notificationEmails: Types.Scalars['Boolean'];
}>;


export type UpdateEmailPreferencesMutation = { __typename?: 'Mutation', updateEmailPreference: { __typename?: 'NotificationPreferences', id: string, notificationEmails: boolean } };


export const NotificationPreferencesDocument = gql`
    query notificationPreferences {
  me {
    id
    notificationPreferences {
      id
      notificationEmails
    }
  }
}
    `;

/**
 * __useNotificationPreferencesQuery__
 *
 * To run a query within a React component, call `useNotificationPreferencesQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationPreferencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationPreferencesQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotificationPreferencesQuery(baseOptions?: Apollo.QueryHookOptions<NotificationPreferencesQuery, NotificationPreferencesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotificationPreferencesQuery, NotificationPreferencesQueryVariables>(NotificationPreferencesDocument, options);
      }
export function useNotificationPreferencesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationPreferencesQuery, NotificationPreferencesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotificationPreferencesQuery, NotificationPreferencesQueryVariables>(NotificationPreferencesDocument, options);
        }
export type NotificationPreferencesQueryHookResult = ReturnType<typeof useNotificationPreferencesQuery>;
export type NotificationPreferencesLazyQueryHookResult = ReturnType<typeof useNotificationPreferencesLazyQuery>;
export type NotificationPreferencesQueryResult = Apollo.QueryResult<NotificationPreferencesQuery, NotificationPreferencesQueryVariables>;
export const UpdateEmailPreferencesDocument = gql`
    mutation updateEmailPreferences($notificationEmails: Boolean!) {
  updateEmailPreference(notificationEmails: $notificationEmails) {
    id
    notificationEmails
  }
}
    `;
export type UpdateEmailPreferencesMutationFn = Apollo.MutationFunction<UpdateEmailPreferencesMutation, UpdateEmailPreferencesMutationVariables>;

/**
 * __useUpdateEmailPreferencesMutation__
 *
 * To run a mutation, you first call `useUpdateEmailPreferencesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEmailPreferencesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEmailPreferencesMutation, { data, loading, error }] = useUpdateEmailPreferencesMutation({
 *   variables: {
 *      notificationEmails: // value for 'notificationEmails'
 *   },
 * });
 */
export function useUpdateEmailPreferencesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEmailPreferencesMutation, UpdateEmailPreferencesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEmailPreferencesMutation, UpdateEmailPreferencesMutationVariables>(UpdateEmailPreferencesDocument, options);
      }
export type UpdateEmailPreferencesMutationHookResult = ReturnType<typeof useUpdateEmailPreferencesMutation>;
export type UpdateEmailPreferencesMutationResult = Apollo.MutationResult<UpdateEmailPreferencesMutation>;
export type UpdateEmailPreferencesMutationOptions = Apollo.BaseMutationOptions<UpdateEmailPreferencesMutation, UpdateEmailPreferencesMutationVariables>;