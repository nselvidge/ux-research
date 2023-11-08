import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'recallai/0.0.0 (api/6.0.0)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Get a list of all jobs.
   *
   * @summary List Jobs
   */
  analysis_job_list(
    metadata?: types.AnalysisJobListMetadataParam
  ): Promise<FetchResponse<200, types.AnalysisJobListResponse200>> {
    return this.core.fetch('/api/v1/analysis/job/', 'get', metadata);
  }

  /**
   * Get a job.
   *
   * @summary Retrieve Job
   */
  analysis_job_retrieve(
    metadata: types.AnalysisJobRetrieveMetadataParam
  ): Promise<FetchResponse<200, types.AnalysisJobRetrieveResponse200>> {
    return this.core.fetch('/api/v1/analysis/job/{id}/', 'get', metadata);
  }

  /**
   * Get bot usage statistics
   *
   * @summary Get Usage
   */
  billing_usage_retrieve(
    metadata?: types.BillingUsageRetrieveMetadataParam
  ): Promise<FetchResponse<200, types.BillingUsageRetrieveResponse200>> {
    return this.core.fetch('/api/v1/billing/usage/', 'get', metadata);
  }

  /**
   * Get a list of all bots
   *
   * @summary List Bots
   */
  bot_list(
    metadata?: types.BotListMetadataParam
  ): Promise<FetchResponse<200, types.BotListResponse200>> {
    return this.core.fetch('/api/v1/bot/', 'get', metadata);
  }

  /**
   * Create a new bot.
   *
   * @summary Create Bot
   */
  bot_create(
    body: types.BotCreateBodyParam
  ): Promise<
    FetchResponse<201, types.BotCreateResponse201> | FetchResponse<507, types.BotCreateResponse507>
  > {
    return this.core.fetch('/api/v1/bot/', 'post', body);
  }

  /**
   * Get a list of all screenshots of the bot
   *
   * @summary List Bot Screenshots
   */
  bot_screenshots_list(
    metadata: types.BotScreenshotsListMetadataParam
  ): Promise<FetchResponse<200, types.BotScreenshotsListResponse200>> {
    return this.core.fetch('/api/v1/bot/{bot_id}/screenshots/', 'get', metadata);
  }

  /**
   * Get a bot screenshot instance.
   *
   * @summary Retrieve Bot Screenshot
   */
  bot_screenshots_retrieve(
    metadata: types.BotScreenshotsRetrieveMetadataParam
  ): Promise<FetchResponse<200, types.BotScreenshotsRetrieveResponse200>> {
    return this.core.fetch('/api/v1/bot/{bot_id}/screenshots/{id}/', 'get', metadata);
  }

  /**
   * Get a bot instance.
   *
   * @summary Retrieve Bot
   */
  bot_retrieve(
    metadata: types.BotRetrieveMetadataParam
  ): Promise<FetchResponse<200, types.BotRetrieveResponse200>> {
    return this.core.fetch('/api/v1/bot/{id}/', 'get', metadata);
  }

  /**
   * Update a Scheduled Bot.
   *
   * @summary Update Scheduled Bot
   */
  bot_partial_update(
    body: types.BotPartialUpdateBodyParam,
    metadata: types.BotPartialUpdateMetadataParam
  ): Promise<FetchResponse<200, types.BotPartialUpdateResponse200>>;
  /**
   * Update a Scheduled Bot.
   *
   * @summary Update Scheduled Bot
   */
  bot_partial_update(
    metadata: types.BotPartialUpdateMetadataParam
  ): Promise<FetchResponse<200, types.BotPartialUpdateResponse200>>;
  /**
   * Update a Scheduled Bot.
   *
   * @summary Update Scheduled Bot
   */
  bot_partial_update(
    body?: types.BotPartialUpdateBodyParam | types.BotPartialUpdateMetadataParam,
    metadata?: types.BotPartialUpdateMetadataParam
  ): Promise<FetchResponse<200, types.BotPartialUpdateResponse200>> {
    return this.core.fetch('/api/v1/bot/{id}/', 'patch', body, metadata);
  }

  /**
   * Deletes a bot. This can only be done on scheduled bots that have not yet joined a call.
   *
   * @summary Delete Scheduled Bot
   */
  bot_destroy(metadata: types.BotDestroyMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/v1/bot/{id}/', 'delete', metadata);
  }

  /**
   * Deletes bot media stored by Recall. This is irreversable.
   *
   * @summary Delete Bot Media
   */
  bot_delete_media_create(
    metadata: types.BotDeleteMediaCreateMetadataParam
  ): Promise<FetchResponse<200, types.BotDeleteMediaCreateResponse200>> {
    return this.core.fetch('/api/v1/bot/{id}/delete_media/', 'post', metadata);
  }

  /**
   * (BETA) Get the results of additional analysis specified by the intelligence parameter.
   * If the call is not yet complete, this returns results from any real-time analysis
   * performed so-far.
   *
   * @summary Get Intelligence Results
   */
  bot_intelligence_retrieve(
    metadata: types.BotIntelligenceRetrieveMetadataParam
  ): Promise<FetchResponse<200, types.BotIntelligenceRetrieveResponse200>> {
    return this.core.fetch('/api/v1/bot/{id}/intelligence/', 'get', metadata);
  }

  /**
   * Removes the bot from the meeting. This is irreversable.
   *
   * @summary Remove Bot From Call
   */
  bot_leave_call_create(
    metadata: types.BotLeaveCallCreateMetadataParam
  ): Promise<FetchResponse<200, types.BotLeaveCallCreateResponse200>> {
    return this.core.fetch('/api/v1/bot/{id}/leave_call/', 'post', metadata);
  }

  /**
   * Causes the bot to send a message in the meeting chat.
   *
   * @summary Send Chat Message
   */
  bot_send_chat_message_create(
    body: types.BotSendChatMessageCreateBodyParam,
    metadata: types.BotSendChatMessageCreateMetadataParam
  ): Promise<FetchResponse<200, types.BotSendChatMessageCreateResponse200>> {
    return this.core.fetch('/api/v1/bot/{id}/send_chat_message/', 'post', body, metadata);
  }

  /**
   * Get the speaker timeline produced by the bot. If the call is not yet complete, this
   * returns the speaker timeline so-far.
   *
   * @summary Get Speaker Timeline
   */
  bot_speaker_timeline_list(
    metadata: types.BotSpeakerTimelineListMetadataParam
  ): Promise<FetchResponse<200, types.BotSpeakerTimelineListResponse200>> {
    return this.core.fetch('/api/v1/bot/{id}/speaker_timeline/', 'get', metadata);
  }

  /**
   * Asynchronously transcribes bot audio
   *
   * @summary Asynchronously Transcribe Bot Audio
   */
  bot_transcribe_create(
    body: types.BotTranscribeCreateBodyParam,
    metadata: types.BotTranscribeCreateMetadataParam
  ): Promise<FetchResponse<200, types.BotTranscribeCreateResponse200>>;
  /**
   * Asynchronously transcribes bot audio
   *
   * @summary Asynchronously Transcribe Bot Audio
   */
  bot_transcribe_create(
    metadata: types.BotTranscribeCreateMetadataParam
  ): Promise<FetchResponse<200, types.BotTranscribeCreateResponse200>>;
  /**
   * Asynchronously transcribes bot audio
   *
   * @summary Asynchronously Transcribe Bot Audio
   */
  bot_transcribe_create(
    body?: types.BotTranscribeCreateBodyParam | types.BotTranscribeCreateMetadataParam,
    metadata?: types.BotTranscribeCreateMetadataParam
  ): Promise<FetchResponse<200, types.BotTranscribeCreateResponse200>> {
    return this.core.fetch('/api/v1/bot/{id}/transcribe/', 'post', body, metadata);
  }

  /**
   * Get the transcript produced by the bot. If the call is not yet complete, this returns
   * the transcript so-far.
   *
   * @summary Get Bot Transcript
   */
  bot_transcript_list(
    metadata: types.BotTranscriptListMetadataParam
  ): Promise<FetchResponse<200, types.BotTranscriptListResponse200>> {
    return this.core.fetch('/api/v1/bot/{id}/transcript/', 'get', metadata);
  }

  /**
   * Generate an authentication token for calendar APIs, scoped to the user. Each token has
   * an expiry of 1 day from time of creation.
   *
   * @summary Get Calendar Auth Token
   */
  calendar_authenticate_create(
    body: types.CalendarAuthenticateCreateBodyParam
  ): Promise<FetchResponse<200, types.CalendarAuthenticateCreateResponse200>> {
    return this.core.fetch('/api/v1/calendar/authenticate/', 'post', body);
  }

  /**
   * List Calendar Meetings
   *
   */
  calendar_meetings_list(
    metadata?: types.CalendarMeetingsListMetadataParam
  ): Promise<FetchResponse<200, types.CalendarMeetingsListResponse200>> {
    return this.core.fetch('/api/v1/calendar/meetings/', 'get', metadata);
  }

  /**
   * Retrieve Calendar Meeting
   *
   */
  calendar_meetings_retrieve(
    metadata: types.CalendarMeetingsRetrieveMetadataParam
  ): Promise<FetchResponse<200, types.CalendarMeetingsRetrieveResponse200>> {
    return this.core.fetch('/api/v1/calendar/meetings/{id}/', 'get', metadata);
  }

  /**
   * Use this endpoint to update override_should_record property of the meeting. This
   * endpoint is rate limited to 10 requests per user per meeting per minute.
   *
   * @summary Update Calendar Meeting
   */
  calendar_meetings_update(
    body: types.CalendarMeetingsUpdateBodyParam,
    metadata: types.CalendarMeetingsUpdateMetadataParam
  ): Promise<FetchResponse<200, types.CalendarMeetingsUpdateResponse200>> {
    return this.core.fetch('/api/v1/calendar/meetings/{id}/', 'put', body, metadata);
  }

  /**
   * Resync the calendar meetings for the user. This endpoint is rate limited to 1 request
   * per user per minute.
   *
   * @summary Refresh Calendar Meetings
   */
  calendar_meetings_refresh_create(): Promise<
    FetchResponse<200, types.CalendarMeetingsRefreshCreateResponse200>
  > {
    return this.core.fetch('/api/v1/calendar/meetings/refresh/', 'post');
  }

  /**
   * Get Calendar User
   *
   */
  calendar_user_retrieve(): Promise<FetchResponse<200, types.CalendarUserRetrieveResponse200>> {
    return this.core.fetch('/api/v1/calendar/user/', 'get');
  }

  /**
   * Update the recording preferences for a calendar user. This endpoint is rate limited to
   * 10 requests per user per minute.
   *
   * @summary Update Recording Preferences
   */
  calendar_user_update(
    body: types.CalendarUserUpdateBodyParam
  ): Promise<FetchResponse<200, types.CalendarUserUpdateResponse200>> {
    return this.core.fetch('/api/v1/calendar/user/', 'put', body);
  }

  /**
   * Delete calendar user(+disconnect any connected calendars). This endpoint is rate limited
   * to 10 requests per user per minute.
   *
   * @summary Delete Calendar User
   */
  calendar_user_destroy(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/v1/calendar/user/', 'delete');
  }

  /**
   * List all calendar users created for the account.
   *
   * @summary List Calendar Users
   */
  calendar_users_list(): Promise<FetchResponse<200, types.CalendarUsersListResponse200>> {
    return this.core.fetch('/api/v1/calendar/users/', 'get');
  }

  /**
   * Get a list of all clips.
   *
   * @summary (BETA) List Clips
   */
  clips_list(
    metadata?: types.ClipsListMetadataParam
  ): Promise<FetchResponse<200, types.ClipsListResponse200>> {
    return this.core.fetch('/api/v1/clips/', 'get', metadata);
  }

  /**
   * Create a clip.
   *
   * @summary (BETA) Create Clip
   */
  clips_create(
    body: types.ClipsCreateBodyParam
  ): Promise<FetchResponse<201, types.ClipsCreateResponse201>> {
    return this.core.fetch('/api/v1/clips/', 'post', body);
  }

  /**
   * Get a clip.
   *
   * @summary (BETA) Retrieve Clip
   */
  clips_retrieve(
    metadata: types.ClipsRetrieveMetadataParam
  ): Promise<FetchResponse<200, types.ClipsRetrieveResponse200>> {
    return this.core.fetch('/api/v1/clips/{id}/', 'get', metadata);
  }

  /**
   * Get the current status of the clip
   *
   * @summary Get Clip Status
   */
  clips_status_list(
    metadata: types.ClipsStatusListMetadataParam
  ): Promise<FetchResponse<200, types.ClipsStatusListResponse200>> {
    return this.core.fetch('/api/v1/clips/{id}/status/', 'get', metadata);
  }

  calendar_accounts_retrieve(
    metadata: types.CalendarAccountsRetrieveMetadataParam
  ): Promise<FetchResponse<200, types.CalendarAccountsRetrieveResponse200>> {
    return this.core.fetch('/api/v2/calendar-accounts/{uuid}/', 'get', metadata);
  }

  /**
   * Get the OAuth access token for this calendar account.
   *
   * @summary Get Access Token
   */
  calendar_accounts_access_token_retrieve(
    metadata: types.CalendarAccountsAccessTokenRetrieveMetadataParam
  ): Promise<
    | FetchResponse<200, types.CalendarAccountsAccessTokenRetrieveResponse200>
    | FetchResponse<400, types.CalendarAccountsAccessTokenRetrieveResponse400>
  > {
    return this.core.fetch('/api/v2/calendar-accounts/{uuid}/access_token/', 'get', metadata);
  }

  /**
   * Get a list of calendar events
   *
   * @summary List Calendar Events
   */
  calendar_events_list(
    metadata?: types.CalendarEventsListMetadataParam
  ): Promise<FetchResponse<200, types.CalendarEventsListResponse200>> {
    return this.core.fetch('/api/v2/calendar-events/', 'get', metadata);
  }

  /**
   * Get a calendar event instance.
   *
   * @summary Retrieve Calendar Event
   */
  calendar_events_retrieve(
    metadata: types.CalendarEventsRetrieveMetadataParam
  ): Promise<FetchResponse<200, types.CalendarEventsRetrieveResponse200>> {
    return this.core.fetch('/api/v2/calendar-events/{id}/', 'get', metadata);
  }

  /**
   * Get a list of calendars
   *
   * @summary List Calendars
   */
  calendars_list(
    metadata?: types.CalendarsListMetadataParam
  ): Promise<FetchResponse<200, types.CalendarsListResponse200>> {
    return this.core.fetch('/api/v2/calendars/', 'get', metadata);
  }

  /**
   * Create a new calendar.
   *
   * @summary Create Calendar
   */
  calendars_create(
    body: types.CalendarsCreateBodyParam
  ): Promise<FetchResponse<201, types.CalendarsCreateResponse201>> {
    return this.core.fetch('/api/v2/calendars/', 'post', body);
  }

  /**
   * Get a calendar instance.
   *
   * @summary Retrieve Calendar
   */
  calendars_retrieve(
    metadata: types.CalendarsRetrieveMetadataParam
  ): Promise<FetchResponse<200, types.CalendarsRetrieveResponse200>> {
    return this.core.fetch('/api/v2/calendars/{id}/', 'get', metadata);
  }

  /**
   * Update an existing calendar.
   *
   * @summary Update Calendar
   */
  calendars_partial_update(
    body: types.CalendarsPartialUpdateBodyParam,
    metadata: types.CalendarsPartialUpdateMetadataParam
  ): Promise<FetchResponse<200, types.CalendarsPartialUpdateResponse200>>;
  /**
   * Update an existing calendar.
   *
   * @summary Update Calendar
   */
  calendars_partial_update(
    metadata: types.CalendarsPartialUpdateMetadataParam
  ): Promise<FetchResponse<200, types.CalendarsPartialUpdateResponse200>>;
  /**
   * Update an existing calendar.
   *
   * @summary Update Calendar
   */
  calendars_partial_update(
    body?: types.CalendarsPartialUpdateBodyParam | types.CalendarsPartialUpdateMetadataParam,
    metadata?: types.CalendarsPartialUpdateMetadataParam
  ): Promise<FetchResponse<200, types.CalendarsPartialUpdateResponse200>> {
    return this.core.fetch('/api/v2/calendars/{id}/', 'patch', body, metadata);
  }

  /**
   * Deletes a calendar. This will disconnect the calendar.
   *
   * @summary Delete Calendar
   */
  calendars_destroy(
    metadata: types.CalendarsDestroyMetadataParam
  ): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/v2/calendars/{id}/', 'delete', metadata);
  }

  recordings_retrieve(
    metadata: types.RecordingsRetrieveMetadataParam
  ): Promise<FetchResponse<200, types.RecordingsRetrieveResponse200>> {
    return this.core.fetch('/api/v2/recordings/{id}/', 'get', metadata);
  }

  /**
   * Run analysis on bot media.
   *
   * @summary Analyze Bot Media
   */
  bot_analyze_create(
    body: types.BotAnalyzeCreateBodyParam,
    metadata: types.BotAnalyzeCreateMetadataParam
  ): Promise<FetchResponse<201, types.BotAnalyzeCreateResponse201>>;
  /**
   * Run analysis on bot media.
   *
   * @summary Analyze Bot Media
   */
  bot_analyze_create(
    metadata: types.BotAnalyzeCreateMetadataParam
  ): Promise<FetchResponse<201, types.BotAnalyzeCreateResponse201>>;
  /**
   * Run analysis on bot media.
   *
   * @summary Analyze Bot Media
   */
  bot_analyze_create(
    body?: types.BotAnalyzeCreateBodyParam | types.BotAnalyzeCreateMetadataParam,
    metadata?: types.BotAnalyzeCreateMetadataParam
  ): Promise<FetchResponse<201, types.BotAnalyzeCreateResponse201>> {
    return this.core.fetch('/api/v2beta/bot/{id}/analyze', 'post', body, metadata);
  }
}

const createSDK = (() => {
  return new SDK();
})();
export default createSDK;

export type {
  AnalysisJobListMetadataParam,
  AnalysisJobListResponse200,
  AnalysisJobRetrieveMetadataParam,
  AnalysisJobRetrieveResponse200,
  BillingUsageRetrieveMetadataParam,
  BillingUsageRetrieveResponse200,
  BotAnalyzeCreateBodyParam,
  BotAnalyzeCreateMetadataParam,
  BotAnalyzeCreateResponse201,
  BotCreateBodyParam,
  BotCreateResponse201,
  BotCreateResponse507,
  BotDeleteMediaCreateMetadataParam,
  BotDeleteMediaCreateResponse200,
  BotDestroyMetadataParam,
  BotIntelligenceRetrieveMetadataParam,
  BotIntelligenceRetrieveResponse200,
  BotLeaveCallCreateMetadataParam,
  BotLeaveCallCreateResponse200,
  BotListMetadataParam,
  BotListResponse200,
  BotPartialUpdateBodyParam,
  BotPartialUpdateMetadataParam,
  BotPartialUpdateResponse200,
  BotRetrieveMetadataParam,
  BotRetrieveResponse200,
  BotScreenshotsListMetadataParam,
  BotScreenshotsListResponse200,
  BotScreenshotsRetrieveMetadataParam,
  BotScreenshotsRetrieveResponse200,
  BotSendChatMessageCreateBodyParam,
  BotSendChatMessageCreateMetadataParam,
  BotSendChatMessageCreateResponse200,
  BotSpeakerTimelineListMetadataParam,
  BotSpeakerTimelineListResponse200,
  BotTranscribeCreateBodyParam,
  BotTranscribeCreateMetadataParam,
  BotTranscribeCreateResponse200,
  BotTranscriptListMetadataParam,
  BotTranscriptListResponse200,
  CalendarAccountsAccessTokenRetrieveMetadataParam,
  CalendarAccountsAccessTokenRetrieveResponse200,
  CalendarAccountsAccessTokenRetrieveResponse400,
  CalendarAccountsRetrieveMetadataParam,
  CalendarAccountsRetrieveResponse200,
  CalendarAuthenticateCreateBodyParam,
  CalendarAuthenticateCreateResponse200,
  CalendarEventsListMetadataParam,
  CalendarEventsListResponse200,
  CalendarEventsRetrieveMetadataParam,
  CalendarEventsRetrieveResponse200,
  CalendarMeetingsListMetadataParam,
  CalendarMeetingsListResponse200,
  CalendarMeetingsRefreshCreateResponse200,
  CalendarMeetingsRetrieveMetadataParam,
  CalendarMeetingsRetrieveResponse200,
  CalendarMeetingsUpdateBodyParam,
  CalendarMeetingsUpdateMetadataParam,
  CalendarMeetingsUpdateResponse200,
  CalendarUserRetrieveResponse200,
  CalendarUserUpdateBodyParam,
  CalendarUserUpdateResponse200,
  CalendarUsersListResponse200,
  CalendarsCreateBodyParam,
  CalendarsCreateResponse201,
  CalendarsDestroyMetadataParam,
  CalendarsListMetadataParam,
  CalendarsListResponse200,
  CalendarsPartialUpdateBodyParam,
  CalendarsPartialUpdateMetadataParam,
  CalendarsPartialUpdateResponse200,
  CalendarsRetrieveMetadataParam,
  CalendarsRetrieveResponse200,
  ClipsCreateBodyParam,
  ClipsCreateResponse201,
  ClipsListMetadataParam,
  ClipsListResponse200,
  ClipsRetrieveMetadataParam,
  ClipsRetrieveResponse200,
  ClipsStatusListMetadataParam,
  ClipsStatusListResponse200,
  RecordingsRetrieveMetadataParam,
  RecordingsRetrieveResponse200,
} from './types';
