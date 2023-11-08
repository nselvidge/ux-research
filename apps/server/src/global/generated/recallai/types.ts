import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type AnalysisJobListMetadataParam = FromSchema<typeof schemas.AnalysisJobList.metadata>;
export type AnalysisJobListResponse200 = FromSchema<
  (typeof schemas.AnalysisJobList.response)['200']
>;
export type AnalysisJobRetrieveMetadataParam = FromSchema<
  typeof schemas.AnalysisJobRetrieve.metadata
>;
export type AnalysisJobRetrieveResponse200 = FromSchema<
  (typeof schemas.AnalysisJobRetrieve.response)['200']
>;
export type BillingUsageRetrieveMetadataParam = FromSchema<
  typeof schemas.BillingUsageRetrieve.metadata
>;
export type BillingUsageRetrieveResponse200 = FromSchema<
  (typeof schemas.BillingUsageRetrieve.response)['200']
>;
export type BotAnalyzeCreateBodyParam = FromSchema<typeof schemas.BotAnalyzeCreate.body>;
export type BotAnalyzeCreateMetadataParam = FromSchema<typeof schemas.BotAnalyzeCreate.metadata>;
export type BotAnalyzeCreateResponse201 = FromSchema<
  (typeof schemas.BotAnalyzeCreate.response)['201']
>;
export type BotCreateBodyParam = FromSchema<typeof schemas.BotCreate.body>;
export type BotCreateResponse201 = FromSchema<(typeof schemas.BotCreate.response)['201']>;
export type BotCreateResponse507 = FromSchema<(typeof schemas.BotCreate.response)['507']>;
export type BotDeleteMediaCreateMetadataParam = FromSchema<
  typeof schemas.BotDeleteMediaCreate.metadata
>;
export type BotDeleteMediaCreateResponse200 = FromSchema<
  (typeof schemas.BotDeleteMediaCreate.response)['200']
>;
export type BotDestroyMetadataParam = FromSchema<typeof schemas.BotDestroy.metadata>;
export type BotIntelligenceRetrieveMetadataParam = FromSchema<
  typeof schemas.BotIntelligenceRetrieve.metadata
>;
export type BotIntelligenceRetrieveResponse200 = FromSchema<
  (typeof schemas.BotIntelligenceRetrieve.response)['200']
>;
export type BotLeaveCallCreateMetadataParam = FromSchema<
  typeof schemas.BotLeaveCallCreate.metadata
>;
export type BotLeaveCallCreateResponse200 = FromSchema<
  (typeof schemas.BotLeaveCallCreate.response)['200']
>;
export type BotListMetadataParam = FromSchema<typeof schemas.BotList.metadata>;
export type BotListResponse200 = FromSchema<(typeof schemas.BotList.response)['200']>;
export type BotPartialUpdateBodyParam = FromSchema<typeof schemas.BotPartialUpdate.body>;
export type BotPartialUpdateMetadataParam = FromSchema<typeof schemas.BotPartialUpdate.metadata>;
export type BotPartialUpdateResponse200 = FromSchema<
  (typeof schemas.BotPartialUpdate.response)['200']
>;
export type BotRetrieveMetadataParam = FromSchema<typeof schemas.BotRetrieve.metadata>;
export type BotRetrieveResponse200 = FromSchema<(typeof schemas.BotRetrieve.response)['200']>;
export type BotScreenshotsListMetadataParam = FromSchema<
  typeof schemas.BotScreenshotsList.metadata
>;
export type BotScreenshotsListResponse200 = FromSchema<
  (typeof schemas.BotScreenshotsList.response)['200']
>;
export type BotScreenshotsRetrieveMetadataParam = FromSchema<
  typeof schemas.BotScreenshotsRetrieve.metadata
>;
export type BotScreenshotsRetrieveResponse200 = FromSchema<
  (typeof schemas.BotScreenshotsRetrieve.response)['200']
>;
export type BotSendChatMessageCreateBodyParam = FromSchema<
  typeof schemas.BotSendChatMessageCreate.body
>;
export type BotSendChatMessageCreateMetadataParam = FromSchema<
  typeof schemas.BotSendChatMessageCreate.metadata
>;
export type BotSendChatMessageCreateResponse200 = FromSchema<
  (typeof schemas.BotSendChatMessageCreate.response)['200']
>;
export type BotSpeakerTimelineListMetadataParam = FromSchema<
  typeof schemas.BotSpeakerTimelineList.metadata
>;
export type BotSpeakerTimelineListResponse200 = FromSchema<
  (typeof schemas.BotSpeakerTimelineList.response)['200']
>;
export type BotTranscribeCreateBodyParam = FromSchema<typeof schemas.BotTranscribeCreate.body>;
export type BotTranscribeCreateMetadataParam = FromSchema<
  typeof schemas.BotTranscribeCreate.metadata
>;
export type BotTranscribeCreateResponse200 = FromSchema<
  (typeof schemas.BotTranscribeCreate.response)['200']
>;
export type BotTranscriptListMetadataParam = FromSchema<typeof schemas.BotTranscriptList.metadata>;
export type BotTranscriptListResponse200 = FromSchema<
  (typeof schemas.BotTranscriptList.response)['200']
>;
export type CalendarAccountsAccessTokenRetrieveMetadataParam = FromSchema<
  typeof schemas.CalendarAccountsAccessTokenRetrieve.metadata
>;
export type CalendarAccountsAccessTokenRetrieveResponse200 = FromSchema<
  (typeof schemas.CalendarAccountsAccessTokenRetrieve.response)['200']
>;
export type CalendarAccountsAccessTokenRetrieveResponse400 = FromSchema<
  (typeof schemas.CalendarAccountsAccessTokenRetrieve.response)['400']
>;
export type CalendarAccountsRetrieveMetadataParam = FromSchema<
  typeof schemas.CalendarAccountsRetrieve.metadata
>;
export type CalendarAccountsRetrieveResponse200 = FromSchema<
  (typeof schemas.CalendarAccountsRetrieve.response)['200']
>;
export type CalendarAuthenticateCreateBodyParam = FromSchema<
  typeof schemas.CalendarAuthenticateCreate.body
>;
export type CalendarAuthenticateCreateResponse200 = FromSchema<
  (typeof schemas.CalendarAuthenticateCreate.response)['200']
>;
export type CalendarEventsListMetadataParam = FromSchema<
  typeof schemas.CalendarEventsList.metadata
>;
export type CalendarEventsListResponse200 = FromSchema<
  (typeof schemas.CalendarEventsList.response)['200']
>;
export type CalendarEventsRetrieveMetadataParam = FromSchema<
  typeof schemas.CalendarEventsRetrieve.metadata
>;
export type CalendarEventsRetrieveResponse200 = FromSchema<
  (typeof schemas.CalendarEventsRetrieve.response)['200']
>;
export type CalendarMeetingsListMetadataParam = FromSchema<
  typeof schemas.CalendarMeetingsList.metadata
>;
export type CalendarMeetingsListResponse200 = FromSchema<
  (typeof schemas.CalendarMeetingsList.response)['200']
>;
export type CalendarMeetingsRefreshCreateResponse200 = FromSchema<
  (typeof schemas.CalendarMeetingsRefreshCreate.response)['200']
>;
export type CalendarMeetingsRetrieveMetadataParam = FromSchema<
  typeof schemas.CalendarMeetingsRetrieve.metadata
>;
export type CalendarMeetingsRetrieveResponse200 = FromSchema<
  (typeof schemas.CalendarMeetingsRetrieve.response)['200']
>;
export type CalendarMeetingsUpdateBodyParam = FromSchema<
  typeof schemas.CalendarMeetingsUpdate.body
>;
export type CalendarMeetingsUpdateMetadataParam = FromSchema<
  typeof schemas.CalendarMeetingsUpdate.metadata
>;
export type CalendarMeetingsUpdateResponse200 = FromSchema<
  (typeof schemas.CalendarMeetingsUpdate.response)['200']
>;
export type CalendarUserRetrieveResponse200 = FromSchema<
  (typeof schemas.CalendarUserRetrieve.response)['200']
>;
export type CalendarUserUpdateBodyParam = FromSchema<typeof schemas.CalendarUserUpdate.body>;
export type CalendarUserUpdateResponse200 = FromSchema<
  (typeof schemas.CalendarUserUpdate.response)['200']
>;
export type CalendarUsersListResponse200 = FromSchema<
  (typeof schemas.CalendarUsersList.response)['200']
>;
export type CalendarsCreateBodyParam = FromSchema<typeof schemas.CalendarsCreate.body>;
export type CalendarsCreateResponse201 = FromSchema<
  (typeof schemas.CalendarsCreate.response)['201']
>;
export type CalendarsDestroyMetadataParam = FromSchema<typeof schemas.CalendarsDestroy.metadata>;
export type CalendarsListMetadataParam = FromSchema<typeof schemas.CalendarsList.metadata>;
export type CalendarsListResponse200 = FromSchema<(typeof schemas.CalendarsList.response)['200']>;
export type CalendarsPartialUpdateBodyParam = FromSchema<
  typeof schemas.CalendarsPartialUpdate.body
>;
export type CalendarsPartialUpdateMetadataParam = FromSchema<
  typeof schemas.CalendarsPartialUpdate.metadata
>;
export type CalendarsPartialUpdateResponse200 = FromSchema<
  (typeof schemas.CalendarsPartialUpdate.response)['200']
>;
export type CalendarsRetrieveMetadataParam = FromSchema<typeof schemas.CalendarsRetrieve.metadata>;
export type CalendarsRetrieveResponse200 = FromSchema<
  (typeof schemas.CalendarsRetrieve.response)['200']
>;
export type ClipsCreateBodyParam = FromSchema<typeof schemas.ClipsCreate.body>;
export type ClipsCreateResponse201 = FromSchema<(typeof schemas.ClipsCreate.response)['201']>;
export type ClipsListMetadataParam = FromSchema<typeof schemas.ClipsList.metadata>;
export type ClipsListResponse200 = FromSchema<(typeof schemas.ClipsList.response)['200']>;
export type ClipsRetrieveMetadataParam = FromSchema<typeof schemas.ClipsRetrieve.metadata>;
export type ClipsRetrieveResponse200 = FromSchema<(typeof schemas.ClipsRetrieve.response)['200']>;
export type ClipsStatusListMetadataParam = FromSchema<typeof schemas.ClipsStatusList.metadata>;
export type ClipsStatusListResponse200 = FromSchema<
  (typeof schemas.ClipsStatusList.response)['200']
>;
export type RecordingsRetrieveMetadataParam = FromSchema<
  typeof schemas.RecordingsRetrieve.metadata
>;
export type RecordingsRetrieveResponse200 = FromSchema<
  (typeof schemas.RecordingsRetrieve.response)['200']
>;
