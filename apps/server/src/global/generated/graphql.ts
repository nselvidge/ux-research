import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GatewayInterview } from '../../domains/interview/interactors/serializers/SerializedInterview';
import { GatewayHighlight, MinimalSerializedHighlight } from '../../domains/interview/interactors/serializers/SerializedHighlight';
import { PersistenceSuggestedHighlight } from '../../domains/interview/interactors/serializers/SerializedSuggestedHighlight';
import { GatewayVideo } from '../../domains/video/interactors/serializers/SerializedVideo';
import { SerializedTranscript, SerializedTranscriptGroup, SerializedTranscriptWord } from '../../domains/interview/interactors/serializers/SerializedTranscript';
import { ExternalUser } from '../../domains/auth/interactors/serializers/SerializedUser';
import { PersistenceProject } from '../../domains/interview/interactors/serializers/SerializedProject';
import { PersistenceWorkspaceUserRoles, GatewayWorkspace } from '../../domains/auth/interactors/serializers/SerializedWorkspace';
import { PersistenceNotificationPreference } from '../../domains/notifications/interactors/serializers/SerializedNotificationPreferences';
import { ApolloContext } from '../typedefs';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type Highlight = {
  __typename?: 'Highlight';
  highlightedRange: WordRange;
  id: Scalars['String'];
  interview: Interview;
  originSuggestionId?: Maybe<Scalars['String']>;
  tags: Array<Maybe<Tag>>;
  transcript?: Maybe<Transcript>;
  video?: Maybe<Video>;
};

export type Interview = {
  __typename?: 'Interview';
  creator: InterviewCreator;
  currentUserCanEdit: Scalars['Boolean'];
  date: Scalars['Date'];
  highlights: Array<Maybe<Highlight>>;
  id: Scalars['String'];
  name: Scalars['String'];
  pendingHighlights: Array<Maybe<PendingHighlight>>;
  projectId?: Maybe<Scalars['String']>;
  questions?: Maybe<Array<Maybe<Question>>>;
  recording?: Maybe<Video>;
  suggestedHighlights: Array<Maybe<SuggestedHighlight>>;
  summary?: Maybe<InterviewSummary>;
  transcript?: Maybe<Transcript>;
  workspace: Workspace;
};

export type InterviewCreator = {
  __typename?: 'InterviewCreator';
  fullName: Scalars['String'];
  id: Scalars['String'];
};

export type InterviewSummary = {
  __typename?: 'InterviewSummary';
  id: Scalars['String'];
  text: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvite: User;
  addHighlight: Highlight;
  addMemberToWorkspace: Workspace;
  addNewTagToHighlight: Highlight;
  addProjectTagToProject: Project;
  addTagToHighlight: Highlight;
  addTagsToHighlight: Highlight;
  approveSuggestedHighlight: Interview;
  archiveInterview: Interview;
  createInviteToken: Scalars['String'];
  createPendingInterview: Interview;
  createProject: Project;
  createTag: Tag;
  createTimestampHighlight: Interview;
  createUploadUrl: UploadInterviewResponse;
  deleteTag: Workspace;
  importInterviewFromZoom?: Maybe<Interview>;
  moveInterviewsToProject: Project;
  recordInterview?: Maybe<Interview>;
  rejectInvite: User;
  rejectSuggestedHighlight: Interview;
  removeHighlight: Interview;
  removeInterviewFromProject: Interview;
  removeProjectTagFromProject: Project;
  removeTagsFromHighlight: Highlight;
  sendInviteEmail: Workspace;
  stopRecording: Scalars['Boolean'];
  updateEmailPreference: NotificationPreferences;
  updateHighlight: Highlight;
  updateInterviewName: Interview;
  updateInterviewSummary: Interview;
  updateProject: Project;
  updateProjectTagPositions: Project;
  updatePublicInterviewLinks: Workspace;
  updateSpeakerName: Participant;
  updateTagColor: Tag;
  updateTagEmoji: Tag;
  updateTagName: Tag;
  updateUserTagOrder: Workspace;
  updateWorkspaceName: Workspace;
};


export type MutationAcceptInviteArgs = {
  workspaceId: Scalars['String'];
};


export type MutationAddHighlightArgs = {
  endWord: TranscriptWordInput;
  interviewId: Scalars['String'];
  startWord: TranscriptWordInput;
  tagIds?: InputMaybe<Array<Scalars['String']>>;
};


export type MutationAddMemberToWorkspaceArgs = {
  memberId: Scalars['String'];
  workspaceId: Scalars['String'];
};


export type MutationAddNewTagToHighlightArgs = {
  color: TagColor;
  emoji: Scalars['String'];
  highlightId: Scalars['String'];
  interviewId: Scalars['String'];
  tagName: Scalars['String'];
};


export type MutationAddProjectTagToProjectArgs = {
  projectId: Scalars['String'];
  tagId: Scalars['String'];
};


export type MutationAddTagToHighlightArgs = {
  highlightId: Scalars['String'];
  interviewId: Scalars['String'];
  tagId: Scalars['String'];
};


export type MutationAddTagsToHighlightArgs = {
  highlightId: Scalars['String'];
  interviewId: Scalars['String'];
  tagIds: Array<Scalars['String']>;
};


export type MutationApproveSuggestedHighlightArgs = {
  interviewId: Scalars['String'];
  suggestedHighlightId: Scalars['String'];
};


export type MutationArchiveInterviewArgs = {
  interviewId: Scalars['String'];
};


export type MutationCreateInviteTokenArgs = {
  workspaceId: Scalars['String'];
};


export type MutationCreatePendingInterviewArgs = {
  projectId?: InputMaybe<Scalars['String']>;
  workspaceId: Scalars['String'];
  zoomId: Scalars['String'];
};


export type MutationCreateProjectArgs = {
  description: Scalars['String'];
  name: Scalars['String'];
  workspaceId: Scalars['String'];
};


export type MutationCreateTagArgs = {
  color?: InputMaybe<TagColor>;
  emoji: Scalars['String'];
  name: Scalars['String'];
  projectId?: InputMaybe<Scalars['String']>;
  workspaceId: Scalars['String'];
};


export type MutationCreateTimestampHighlightArgs = {
  interviewId: Scalars['String'];
  tagId?: InputMaybe<Scalars['String']>;
  timestamp: Scalars['Date'];
};


export type MutationCreateUploadUrlArgs = {
  interviewDate: Scalars['Date'];
  interviewName: Scalars['String'];
  workspaceId: Scalars['String'];
};


export type MutationDeleteTagArgs = {
  tagId: Scalars['String'];
};


export type MutationImportInterviewFromZoomArgs = {
  externalId: Scalars['String'];
  workspaceId: Scalars['String'];
};


export type MutationMoveInterviewsToProjectArgs = {
  interviewIds: Array<Scalars['String']>;
  projectId: Scalars['String'];
};


export type MutationRecordInterviewArgs = {
  projectId?: InputMaybe<Scalars['String']>;
  workspaceId: Scalars['String'];
  zoomId: Scalars['String'];
};


export type MutationRejectInviteArgs = {
  workspaceId: Scalars['String'];
};


export type MutationRejectSuggestedHighlightArgs = {
  interviewId: Scalars['String'];
  suggestedHighlightId: Scalars['String'];
};


export type MutationRemoveHighlightArgs = {
  highlightId: Scalars['String'];
  interviewId: Scalars['String'];
};


export type MutationRemoveInterviewFromProjectArgs = {
  interviewId: Scalars['String'];
};


export type MutationRemoveProjectTagFromProjectArgs = {
  projectId: Scalars['String'];
  tagId: Scalars['String'];
};


export type MutationRemoveTagsFromHighlightArgs = {
  highlightId: Scalars['String'];
  interviewId: Scalars['String'];
  tagIds: Array<Scalars['String']>;
};


export type MutationSendInviteEmailArgs = {
  email: Scalars['String'];
  workspaceId: Scalars['String'];
};


export type MutationStopRecordingArgs = {
  meetingId: Scalars['String'];
};


export type MutationUpdateEmailPreferenceArgs = {
  notificationEmails: Scalars['Boolean'];
};


export type MutationUpdateHighlightArgs = {
  endTime: Scalars['Int'];
  highlightId: Scalars['String'];
  interviewId: Scalars['String'];
  startTime: Scalars['Int'];
};


export type MutationUpdateInterviewNameArgs = {
  id: Scalars['String'];
  name: Scalars['String'];
};


export type MutationUpdateInterviewSummaryArgs = {
  interviewId: Scalars['String'];
  text: Scalars['String'];
};


export type MutationUpdateProjectArgs = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  projectId: Scalars['String'];
};


export type MutationUpdateProjectTagPositionsArgs = {
  projectId: Scalars['String'];
  tagIds: Array<Scalars['String']>;
};


export type MutationUpdatePublicInterviewLinksArgs = {
  publicInterviewLinks: Scalars['Boolean'];
  workspaceId: Scalars['String'];
};


export type MutationUpdateSpeakerNameArgs = {
  interviewId: Scalars['String'];
  newName: Scalars['String'];
  speakerId: Scalars['String'];
};


export type MutationUpdateTagColorArgs = {
  color: TagColor;
  tagId: Scalars['String'];
};


export type MutationUpdateTagEmojiArgs = {
  emoji: Scalars['String'];
  tagId: Scalars['String'];
};


export type MutationUpdateTagNameArgs = {
  name: Scalars['String'];
  tagId: Scalars['String'];
};


export type MutationUpdateUserTagOrderArgs = {
  tagIds: Array<Scalars['String']>;
  workspaceId: Scalars['String'];
};


export type MutationUpdateWorkspaceNameArgs = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type NotificationPreferences = {
  __typename?: 'NotificationPreferences';
  id: Scalars['String'];
  notificationEmails: Scalars['Boolean'];
  userId: Scalars['String'];
};

export type Participant = {
  __typename?: 'Participant';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type PendingHighlight = {
  __typename?: 'PendingHighlight';
  id: Scalars['String'];
  tags: Array<Maybe<Tag>>;
  timestamp: Scalars['Date'];
};

export type PendingInvite = {
  __typename?: 'PendingInvite';
  email: Scalars['String'];
  id: Scalars['String'];
  role: RoleType;
};

export type Project = {
  __typename?: 'Project';
  description: Scalars['String'];
  highlightCounts: Array<Maybe<TagHighlightCounts>>;
  id: Scalars['String'];
  interviewCount: Scalars['Int'];
  interviewTags: Array<Maybe<Tag>>;
  interviews: Array<Maybe<Interview>>;
  name: Scalars['String'];
  projectTags: Array<Maybe<ProjectTag>>;
  taglessHighlightCounts: Scalars['Int'];
};

export type ProjectTag = {
  __typename?: 'ProjectTag';
  id: Scalars['String'];
  position: Scalars['Int'];
  tag: Tag;
};

export type Query = {
  __typename?: 'Query';
  getHighlightsForTag: Array<Maybe<Highlight>>;
  getHighlightsWithoutTag: Array<Maybe<Highlight>>;
  getPendingInterview?: Maybe<Interview>;
  getPendingInterviewByRecordingTarget?: Maybe<Interview>;
  getTagHighlightCounts: Array<Maybe<TagHighlightCounts>>;
  getTaglessHighlightCounts: Scalars['Int'];
  highlight: Highlight;
  interview: Interview;
  isConnectedToZoom: Scalars['Boolean'];
  listInterviews?: Maybe<Array<Maybe<Interview>>>;
  me?: Maybe<User>;
  project: Project;
  recordingStatus?: Maybe<RecordingStatus>;
  searchUsersByEmail?: Maybe<Array<Maybe<User>>>;
  workspace?: Maybe<Workspace>;
  zoomRecordingList?: Maybe<VideoProviderRecordingList>;
};


export type QueryGetHighlightsForTagArgs = {
  projectId?: InputMaybe<Scalars['String']>;
  tagId: Scalars['String'];
};


export type QueryGetHighlightsWithoutTagArgs = {
  projectId?: InputMaybe<Scalars['String']>;
  workspaceId: Scalars['String'];
};


export type QueryGetPendingInterviewArgs = {
  externalId: Scalars['String'];
};


export type QueryGetPendingInterviewByRecordingTargetArgs = {
  externalId: Scalars['String'];
};


export type QueryGetTagHighlightCountsArgs = {
  workspaceId: Scalars['String'];
};


export type QueryGetTaglessHighlightCountsArgs = {
  workspaceId: Scalars['String'];
};


export type QueryHighlightArgs = {
  id: Scalars['String'];
};


export type QueryInterviewArgs = {
  id: Scalars['String'];
};


export type QueryListInterviewsArgs = {
  projectId?: InputMaybe<Scalars['String']>;
  workspaceId: Scalars['String'];
};


export type QueryProjectArgs = {
  id: Scalars['String'];
};


export type QueryRecordingStatusArgs = {
  meetingId: Scalars['String'];
};


export type QuerySearchUsersByEmailArgs = {
  emailQuery: Scalars['String'];
};


export type QueryWorkspaceArgs = {
  id: Scalars['String'];
};

export type Question = {
  __typename?: 'Question';
  question: WordRange;
  response: WordRange;
};

export type RecordingStatus =
  | 'done'
  | 'pending'
  | 'recording';

export type RoleType =
  | 'admin'
  | 'member';

export type SuggestedHighlight = {
  __typename?: 'SuggestedHighlight';
  highlightedRange: WordRange;
  id: Scalars['String'];
  tags: Array<Maybe<Tag>>;
};

export type Tag = {
  __typename?: 'Tag';
  color: TagColor;
  emoji: Scalars['String'];
  id: Scalars['String'];
  isDefault: Scalars['Boolean'];
  name: Scalars['String'];
  workspaceId: Scalars['String'];
};

export type TagColor =
  | 'green'
  | 'indigo'
  | 'orange'
  | 'purple'
  | 'red'
  | 'sky'
  | 'yellow';

export type TagHighlightCounts = {
  __typename?: 'TagHighlightCounts';
  highlightCount: Scalars['Int'];
  tagId: Scalars['String'];
};

export type Transcript = {
  __typename?: 'Transcript';
  groups?: Maybe<Array<Maybe<TranscriptGroup>>>;
  id?: Maybe<Scalars['String']>;
  isPending?: Maybe<Scalars['Boolean']>;
};

export type TranscriptGroup = {
  __typename?: 'TranscriptGroup';
  end: Scalars['Float'];
  groupNumber: Scalars['Int'];
  id: Scalars['String'];
  speaker: Participant;
  start: Scalars['Float'];
  text: Scalars['String'];
  words: Array<TranscriptWord>;
};

export type TranscriptWord = {
  __typename?: 'TranscriptWord';
  end: Scalars['Float'];
  groupNumber: Scalars['Int'];
  id: Scalars['String'];
  start: Scalars['Float'];
  text: Scalars['String'];
  wordNumber: Scalars['Int'];
};

export type TranscriptWordInput = {
  groupNumber: Scalars['Int'];
  wordNumber: Scalars['Int'];
};

export type UploadInterviewResponse = {
  __typename?: 'UploadInterviewResponse';
  interviewId: Scalars['String'];
  uploadUrl: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  fullName: Scalars['String'];
  id: Scalars['String'];
  notificationPreferences?: Maybe<NotificationPreferences>;
  pendingWorkspaceInvites: Array<Maybe<WorkspaceInvite>>;
  workspaces: Array<Workspace>;
};

export type Video = {
  __typename?: 'Video';
  id: Scalars['String'];
  previewGifUrl?: Maybe<Scalars['String']>;
  previewImageUrl?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type VideoProviderRecording = {
  __typename?: 'VideoProviderRecording';
  externalId: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  startTime: Scalars['String'];
};

export type VideoProviderRecordingList = {
  __typename?: 'VideoProviderRecordingList';
  nextPageCursor?: Maybe<Scalars['String']>;
  recordings?: Maybe<Array<Maybe<VideoProviderRecording>>>;
  totalCount: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type WordRange = {
  __typename?: 'WordRange';
  endWord: TranscriptWord;
  startWord: TranscriptWord;
  text: Scalars['String'];
};

export type Workspace = {
  __typename?: 'Workspace';
  currentUserInviteToken?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  pendingInvites: Array<Maybe<PendingInvite>>;
  projects: Array<Maybe<Project>>;
  publicInterviewLinks: Scalars['Boolean'];
  roles: Array<WorkspaceRole>;
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type WorkspaceInvite = {
  __typename?: 'WorkspaceInvite';
  inviterName: Scalars['String'];
  workspaceId: Scalars['String'];
  workspaceName: Scalars['String'];
};

export type WorkspaceRole = {
  __typename?: 'WorkspaceRole';
  organizationId: Scalars['String'];
  type: RoleType;
  user: User;
  userId: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Highlight: ResolverTypeWrapper<GatewayHighlight>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Interview: ResolverTypeWrapper<GatewayInterview>;
  InterviewCreator: ResolverTypeWrapper<InterviewCreator>;
  InterviewSummary: ResolverTypeWrapper<InterviewSummary>;
  Mutation: ResolverTypeWrapper<{}>;
  NotificationPreferences: ResolverTypeWrapper<PersistenceNotificationPreference>;
  Participant: ResolverTypeWrapper<Participant>;
  PendingHighlight: ResolverTypeWrapper<MinimalSerializedHighlight>;
  PendingInvite: ResolverTypeWrapper<PendingInvite>;
  Project: ResolverTypeWrapper<PersistenceProject>;
  ProjectTag: ResolverTypeWrapper<ProjectTag>;
  Query: ResolverTypeWrapper<{}>;
  Question: ResolverTypeWrapper<Omit<Question, 'question' | 'response'> & { question: ResolversTypes['WordRange'], response: ResolversTypes['WordRange'] }>;
  RecordingStatus: RecordingStatus;
  RoleType: RoleType;
  String: ResolverTypeWrapper<Scalars['String']>;
  SuggestedHighlight: ResolverTypeWrapper<PersistenceSuggestedHighlight>;
  Tag: ResolverTypeWrapper<Tag>;
  TagColor: TagColor;
  TagHighlightCounts: ResolverTypeWrapper<TagHighlightCounts>;
  Transcript: ResolverTypeWrapper<SerializedTranscript>;
  TranscriptGroup: ResolverTypeWrapper<SerializedTranscriptGroup>;
  TranscriptWord: ResolverTypeWrapper<SerializedTranscriptWord>;
  TranscriptWordInput: TranscriptWordInput;
  UploadInterviewResponse: ResolverTypeWrapper<UploadInterviewResponse>;
  User: ResolverTypeWrapper<ExternalUser>;
  Video: ResolverTypeWrapper<GatewayVideo>;
  VideoProviderRecording: ResolverTypeWrapper<VideoProviderRecording>;
  VideoProviderRecordingList: ResolverTypeWrapper<VideoProviderRecordingList>;
  WordRange: ResolverTypeWrapper<Omit<WordRange, 'endWord' | 'startWord'> & { endWord: ResolversTypes['TranscriptWord'], startWord: ResolversTypes['TranscriptWord'] }>;
  Workspace: ResolverTypeWrapper<GatewayWorkspace>;
  WorkspaceInvite: ResolverTypeWrapper<WorkspaceInvite>;
  WorkspaceRole: ResolverTypeWrapper<PersistenceWorkspaceUserRoles>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Date: Scalars['Date'];
  Float: Scalars['Float'];
  Highlight: GatewayHighlight;
  Int: Scalars['Int'];
  Interview: GatewayInterview;
  InterviewCreator: InterviewCreator;
  InterviewSummary: InterviewSummary;
  Mutation: {};
  NotificationPreferences: PersistenceNotificationPreference;
  Participant: Participant;
  PendingHighlight: MinimalSerializedHighlight;
  PendingInvite: PendingInvite;
  Project: PersistenceProject;
  ProjectTag: ProjectTag;
  Query: {};
  Question: Omit<Question, 'question' | 'response'> & { question: ResolversParentTypes['WordRange'], response: ResolversParentTypes['WordRange'] };
  String: Scalars['String'];
  SuggestedHighlight: PersistenceSuggestedHighlight;
  Tag: Tag;
  TagHighlightCounts: TagHighlightCounts;
  Transcript: SerializedTranscript;
  TranscriptGroup: SerializedTranscriptGroup;
  TranscriptWord: SerializedTranscriptWord;
  TranscriptWordInput: TranscriptWordInput;
  UploadInterviewResponse: UploadInterviewResponse;
  User: ExternalUser;
  Video: GatewayVideo;
  VideoProviderRecording: VideoProviderRecording;
  VideoProviderRecordingList: VideoProviderRecordingList;
  WordRange: Omit<WordRange, 'endWord' | 'startWord'> & { endWord: ResolversParentTypes['TranscriptWord'], startWord: ResolversParentTypes['TranscriptWord'] };
  Workspace: GatewayWorkspace;
  WorkspaceInvite: WorkspaceInvite;
  WorkspaceRole: PersistenceWorkspaceUserRoles;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type HighlightResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Highlight'] = ResolversParentTypes['Highlight']> = {
  highlightedRange?: Resolver<ResolversTypes['WordRange'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  interview?: Resolver<ResolversTypes['Interview'], ParentType, ContextType>;
  originSuggestionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  transcript?: Resolver<Maybe<ResolversTypes['Transcript']>, ParentType, ContextType>;
  video?: Resolver<Maybe<ResolversTypes['Video']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InterviewResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Interview'] = ResolversParentTypes['Interview']> = {
  creator?: Resolver<ResolversTypes['InterviewCreator'], ParentType, ContextType>;
  currentUserCanEdit?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  highlights?: Resolver<Array<Maybe<ResolversTypes['Highlight']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pendingHighlights?: Resolver<Array<Maybe<ResolversTypes['PendingHighlight']>>, ParentType, ContextType>;
  projectId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  questions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Question']>>>, ParentType, ContextType>;
  recording?: Resolver<Maybe<ResolversTypes['Video']>, ParentType, ContextType>;
  suggestedHighlights?: Resolver<Array<Maybe<ResolversTypes['SuggestedHighlight']>>, ParentType, ContextType>;
  summary?: Resolver<Maybe<ResolversTypes['InterviewSummary']>, ParentType, ContextType>;
  transcript?: Resolver<Maybe<ResolversTypes['Transcript']>, ParentType, ContextType>;
  workspace?: Resolver<ResolversTypes['Workspace'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InterviewCreatorResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['InterviewCreator'] = ResolversParentTypes['InterviewCreator']> = {
  fullName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InterviewSummaryResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['InterviewSummary'] = ResolversParentTypes['InterviewSummary']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptInvite?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationAcceptInviteArgs, 'workspaceId'>>;
  addHighlight?: Resolver<ResolversTypes['Highlight'], ParentType, ContextType, RequireFields<MutationAddHighlightArgs, 'endWord' | 'interviewId' | 'startWord'>>;
  addMemberToWorkspace?: Resolver<ResolversTypes['Workspace'], ParentType, ContextType, RequireFields<MutationAddMemberToWorkspaceArgs, 'memberId' | 'workspaceId'>>;
  addNewTagToHighlight?: Resolver<ResolversTypes['Highlight'], ParentType, ContextType, RequireFields<MutationAddNewTagToHighlightArgs, 'color' | 'emoji' | 'highlightId' | 'interviewId' | 'tagName'>>;
  addProjectTagToProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationAddProjectTagToProjectArgs, 'projectId' | 'tagId'>>;
  addTagToHighlight?: Resolver<ResolversTypes['Highlight'], ParentType, ContextType, RequireFields<MutationAddTagToHighlightArgs, 'highlightId' | 'interviewId' | 'tagId'>>;
  addTagsToHighlight?: Resolver<ResolversTypes['Highlight'], ParentType, ContextType, RequireFields<MutationAddTagsToHighlightArgs, 'highlightId' | 'interviewId' | 'tagIds'>>;
  approveSuggestedHighlight?: Resolver<ResolversTypes['Interview'], ParentType, ContextType, RequireFields<MutationApproveSuggestedHighlightArgs, 'interviewId' | 'suggestedHighlightId'>>;
  archiveInterview?: Resolver<ResolversTypes['Interview'], ParentType, ContextType, RequireFields<MutationArchiveInterviewArgs, 'interviewId'>>;
  createInviteToken?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationCreateInviteTokenArgs, 'workspaceId'>>;
  createPendingInterview?: Resolver<ResolversTypes['Interview'], ParentType, ContextType, RequireFields<MutationCreatePendingInterviewArgs, 'workspaceId' | 'zoomId'>>;
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'description' | 'name' | 'workspaceId'>>;
  createTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'emoji' | 'name' | 'workspaceId'>>;
  createTimestampHighlight?: Resolver<ResolversTypes['Interview'], ParentType, ContextType, RequireFields<MutationCreateTimestampHighlightArgs, 'interviewId' | 'timestamp'>>;
  createUploadUrl?: Resolver<ResolversTypes['UploadInterviewResponse'], ParentType, ContextType, RequireFields<MutationCreateUploadUrlArgs, 'interviewDate' | 'interviewName' | 'workspaceId'>>;
  deleteTag?: Resolver<ResolversTypes['Workspace'], ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'tagId'>>;
  importInterviewFromZoom?: Resolver<Maybe<ResolversTypes['Interview']>, ParentType, ContextType, RequireFields<MutationImportInterviewFromZoomArgs, 'externalId' | 'workspaceId'>>;
  moveInterviewsToProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationMoveInterviewsToProjectArgs, 'interviewIds' | 'projectId'>>;
  recordInterview?: Resolver<Maybe<ResolversTypes['Interview']>, ParentType, ContextType, RequireFields<MutationRecordInterviewArgs, 'workspaceId' | 'zoomId'>>;
  rejectInvite?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRejectInviteArgs, 'workspaceId'>>;
  rejectSuggestedHighlight?: Resolver<ResolversTypes['Interview'], ParentType, ContextType, RequireFields<MutationRejectSuggestedHighlightArgs, 'interviewId' | 'suggestedHighlightId'>>;
  removeHighlight?: Resolver<ResolversTypes['Interview'], ParentType, ContextType, RequireFields<MutationRemoveHighlightArgs, 'highlightId' | 'interviewId'>>;
  removeInterviewFromProject?: Resolver<ResolversTypes['Interview'], ParentType, ContextType, RequireFields<MutationRemoveInterviewFromProjectArgs, 'interviewId'>>;
  removeProjectTagFromProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationRemoveProjectTagFromProjectArgs, 'projectId' | 'tagId'>>;
  removeTagsFromHighlight?: Resolver<ResolversTypes['Highlight'], ParentType, ContextType, RequireFields<MutationRemoveTagsFromHighlightArgs, 'highlightId' | 'interviewId' | 'tagIds'>>;
  sendInviteEmail?: Resolver<ResolversTypes['Workspace'], ParentType, ContextType, RequireFields<MutationSendInviteEmailArgs, 'email' | 'workspaceId'>>;
  stopRecording?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationStopRecordingArgs, 'meetingId'>>;
  updateEmailPreference?: Resolver<ResolversTypes['NotificationPreferences'], ParentType, ContextType, RequireFields<MutationUpdateEmailPreferenceArgs, 'notificationEmails'>>;
  updateHighlight?: Resolver<ResolversTypes['Highlight'], ParentType, ContextType, RequireFields<MutationUpdateHighlightArgs, 'endTime' | 'highlightId' | 'interviewId' | 'startTime'>>;
  updateInterviewName?: Resolver<ResolversTypes['Interview'], ParentType, ContextType, RequireFields<MutationUpdateInterviewNameArgs, 'id' | 'name'>>;
  updateInterviewSummary?: Resolver<ResolversTypes['Interview'], ParentType, ContextType, RequireFields<MutationUpdateInterviewSummaryArgs, 'interviewId' | 'text'>>;
  updateProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationUpdateProjectArgs, 'projectId'>>;
  updateProjectTagPositions?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationUpdateProjectTagPositionsArgs, 'projectId' | 'tagIds'>>;
  updatePublicInterviewLinks?: Resolver<ResolversTypes['Workspace'], ParentType, ContextType, RequireFields<MutationUpdatePublicInterviewLinksArgs, 'publicInterviewLinks' | 'workspaceId'>>;
  updateSpeakerName?: Resolver<ResolversTypes['Participant'], ParentType, ContextType, RequireFields<MutationUpdateSpeakerNameArgs, 'interviewId' | 'newName' | 'speakerId'>>;
  updateTagColor?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdateTagColorArgs, 'color' | 'tagId'>>;
  updateTagEmoji?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdateTagEmojiArgs, 'emoji' | 'tagId'>>;
  updateTagName?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdateTagNameArgs, 'name' | 'tagId'>>;
  updateUserTagOrder?: Resolver<ResolversTypes['Workspace'], ParentType, ContextType, RequireFields<MutationUpdateUserTagOrderArgs, 'tagIds' | 'workspaceId'>>;
  updateWorkspaceName?: Resolver<ResolversTypes['Workspace'], ParentType, ContextType, RequireFields<MutationUpdateWorkspaceNameArgs, 'id' | 'name'>>;
};

export type NotificationPreferencesResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['NotificationPreferences'] = ResolversParentTypes['NotificationPreferences']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notificationEmails?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ParticipantResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Participant'] = ResolversParentTypes['Participant']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PendingHighlightResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['PendingHighlight'] = ResolversParentTypes['PendingHighlight']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PendingInviteResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['PendingInvite'] = ResolversParentTypes['PendingInvite']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['RoleType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  highlightCounts?: Resolver<Array<Maybe<ResolversTypes['TagHighlightCounts']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  interviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  interviewTags?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  interviews?: Resolver<Array<Maybe<ResolversTypes['Interview']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projectTags?: Resolver<Array<Maybe<ResolversTypes['ProjectTag']>>, ParentType, ContextType>;
  taglessHighlightCounts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectTagResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['ProjectTag'] = ResolversParentTypes['ProjectTag']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getHighlightsForTag?: Resolver<Array<Maybe<ResolversTypes['Highlight']>>, ParentType, ContextType, RequireFields<QueryGetHighlightsForTagArgs, 'tagId'>>;
  getHighlightsWithoutTag?: Resolver<Array<Maybe<ResolversTypes['Highlight']>>, ParentType, ContextType, RequireFields<QueryGetHighlightsWithoutTagArgs, 'workspaceId'>>;
  getPendingInterview?: Resolver<Maybe<ResolversTypes['Interview']>, ParentType, ContextType, RequireFields<QueryGetPendingInterviewArgs, 'externalId'>>;
  getPendingInterviewByRecordingTarget?: Resolver<Maybe<ResolversTypes['Interview']>, ParentType, ContextType, RequireFields<QueryGetPendingInterviewByRecordingTargetArgs, 'externalId'>>;
  getTagHighlightCounts?: Resolver<Array<Maybe<ResolversTypes['TagHighlightCounts']>>, ParentType, ContextType, RequireFields<QueryGetTagHighlightCountsArgs, 'workspaceId'>>;
  getTaglessHighlightCounts?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<QueryGetTaglessHighlightCountsArgs, 'workspaceId'>>;
  highlight?: Resolver<ResolversTypes['Highlight'], ParentType, ContextType, RequireFields<QueryHighlightArgs, 'id'>>;
  interview?: Resolver<ResolversTypes['Interview'], ParentType, ContextType, RequireFields<QueryInterviewArgs, 'id'>>;
  isConnectedToZoom?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  listInterviews?: Resolver<Maybe<Array<Maybe<ResolversTypes['Interview']>>>, ParentType, ContextType, RequireFields<QueryListInterviewsArgs, 'workspaceId'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<QueryProjectArgs, 'id'>>;
  recordingStatus?: Resolver<Maybe<ResolversTypes['RecordingStatus']>, ParentType, ContextType, RequireFields<QueryRecordingStatusArgs, 'meetingId'>>;
  searchUsersByEmail?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<QuerySearchUsersByEmailArgs, 'emailQuery'>>;
  workspace?: Resolver<Maybe<ResolversTypes['Workspace']>, ParentType, ContextType, RequireFields<QueryWorkspaceArgs, 'id'>>;
  zoomRecordingList?: Resolver<Maybe<ResolversTypes['VideoProviderRecordingList']>, ParentType, ContextType>;
};

export type QuestionResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Question'] = ResolversParentTypes['Question']> = {
  question?: Resolver<ResolversTypes['WordRange'], ParentType, ContextType>;
  response?: Resolver<ResolversTypes['WordRange'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SuggestedHighlightResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['SuggestedHighlight'] = ResolversParentTypes['SuggestedHighlight']> = {
  highlightedRange?: Resolver<ResolversTypes['WordRange'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  color?: Resolver<ResolversTypes['TagColor'], ParentType, ContextType>;
  emoji?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isDefault?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workspaceId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagHighlightCountsResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['TagHighlightCounts'] = ResolversParentTypes['TagHighlightCounts']> = {
  highlightCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tagId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TranscriptResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Transcript'] = ResolversParentTypes['Transcript']> = {
  groups?: Resolver<Maybe<Array<Maybe<ResolversTypes['TranscriptGroup']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isPending?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TranscriptGroupResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['TranscriptGroup'] = ResolversParentTypes['TranscriptGroup']> = {
  end?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  groupNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  speaker?: Resolver<ResolversTypes['Participant'], ParentType, ContextType>;
  start?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  words?: Resolver<Array<ResolversTypes['TranscriptWord']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TranscriptWordResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['TranscriptWord'] = ResolversParentTypes['TranscriptWord']> = {
  end?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  groupNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  start?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wordNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UploadInterviewResponseResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['UploadInterviewResponse'] = ResolversParentTypes['UploadInterviewResponse']> = {
  interviewId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uploadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fullName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notificationPreferences?: Resolver<Maybe<ResolversTypes['NotificationPreferences']>, ParentType, ContextType>;
  pendingWorkspaceInvites?: Resolver<Array<Maybe<ResolversTypes['WorkspaceInvite']>>, ParentType, ContextType>;
  workspaces?: Resolver<Array<ResolversTypes['Workspace']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Video'] = ResolversParentTypes['Video']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  previewGifUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  previewImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoProviderRecordingResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['VideoProviderRecording'] = ResolversParentTypes['VideoProviderRecording']> = {
  externalId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoProviderRecordingListResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['VideoProviderRecordingList'] = ResolversParentTypes['VideoProviderRecordingList']> = {
  nextPageCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recordings?: Resolver<Maybe<Array<Maybe<ResolversTypes['VideoProviderRecording']>>>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WordRangeResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['WordRange'] = ResolversParentTypes['WordRange']> = {
  endWord?: Resolver<ResolversTypes['TranscriptWord'], ParentType, ContextType>;
  startWord?: Resolver<ResolversTypes['TranscriptWord'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkspaceResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Workspace'] = ResolversParentTypes['Workspace']> = {
  currentUserInviteToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pendingInvites?: Resolver<Array<Maybe<ResolversTypes['PendingInvite']>>, ParentType, ContextType>;
  projects?: Resolver<Array<Maybe<ResolversTypes['Project']>>, ParentType, ContextType>;
  publicInterviewLinks?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['WorkspaceRole']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tag']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkspaceInviteResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['WorkspaceInvite'] = ResolversParentTypes['WorkspaceInvite']> = {
  inviterName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workspaceId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workspaceName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkspaceRoleResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['WorkspaceRole'] = ResolversParentTypes['WorkspaceRole']> = {
  organizationId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['RoleType'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = ApolloContext> = {
  Date?: GraphQLScalarType;
  Highlight?: HighlightResolvers<ContextType>;
  Interview?: InterviewResolvers<ContextType>;
  InterviewCreator?: InterviewCreatorResolvers<ContextType>;
  InterviewSummary?: InterviewSummaryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotificationPreferences?: NotificationPreferencesResolvers<ContextType>;
  Participant?: ParticipantResolvers<ContextType>;
  PendingHighlight?: PendingHighlightResolvers<ContextType>;
  PendingInvite?: PendingInviteResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  ProjectTag?: ProjectTagResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Question?: QuestionResolvers<ContextType>;
  SuggestedHighlight?: SuggestedHighlightResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TagHighlightCounts?: TagHighlightCountsResolvers<ContextType>;
  Transcript?: TranscriptResolvers<ContextType>;
  TranscriptGroup?: TranscriptGroupResolvers<ContextType>;
  TranscriptWord?: TranscriptWordResolvers<ContextType>;
  UploadInterviewResponse?: UploadInterviewResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Video?: VideoResolvers<ContextType>;
  VideoProviderRecording?: VideoProviderRecordingResolvers<ContextType>;
  VideoProviderRecordingList?: VideoProviderRecordingListResolvers<ContextType>;
  WordRange?: WordRangeResolvers<ContextType>;
  Workspace?: WorkspaceResolvers<ContextType>;
  WorkspaceInvite?: WorkspaceInviteResolvers<ContextType>;
  WorkspaceRole?: WorkspaceRoleResolvers<ContextType>;
};

