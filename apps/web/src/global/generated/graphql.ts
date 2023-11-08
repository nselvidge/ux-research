export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

export enum RecordingStatus {
  Done = 'done',
  Pending = 'pending',
  Recording = 'recording'
}

export enum RoleType {
  Admin = 'admin',
  Member = 'member'
}

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

export enum TagColor {
  Green = 'green',
  Indigo = 'indigo',
  Orange = 'orange',
  Purple = 'purple',
  Red = 'red',
  Sky = 'sky',
  Yellow = 'yellow'
}

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
