import { GatewayVideo } from "@root/domains/video/interactors/serializers/SerializedVideo";
import { gql } from "apollo-server";
import DataLoader from "dataloader";
import { GraphQLScalarType, Kind } from "graphql";
import { isDate, isNumber, isString } from "remeda";

export type ApolloContext = {
  userId: string;
  loaders: {
    video: DataLoader<string, GatewayVideo | undefined>;
  };
};

export const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value: unknown) {
    if (!isDate(value)) {
      throw new Error("must pass date to serialize");
    }
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value: unknown) {
    if (!isNumber(value) && !isString(value)) {
      throw new Error("value must be a number or string");
    }
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

export const typeDefs = gql`
  scalar Date

  type InterviewCreator {
    id: String!
    fullName: String!
  }

  type InterviewSummary {
    id: String!
    text: String!
  }

  type Interview {
    id: String!
    date: Date!
    name: String!
    recording: Video
    transcript: Transcript
    questions: [Question]
    highlights: [Highlight]!
    workspace: Workspace!
    currentUserCanEdit: Boolean!
    pendingHighlights: [PendingHighlight]!
    suggestedHighlights: [SuggestedHighlight]!
    creator: InterviewCreator!
    summary: InterviewSummary
    projectId: String
  }

  type Video {
    id: String!
    url: String
    previewImageUrl: String
    previewGifUrl: String
  }

  type WordRange {
    text: String!
    startWord: TranscriptWord!
    endWord: TranscriptWord!
  }

  type Question {
    question: WordRange!
    response: WordRange!
  }

  type Highlight {
    id: String!
    highlightedRange: WordRange!
    video: Video
    transcript: Transcript
    tags: [Tag]!
    interview: Interview!
    originSuggestionId: String
  }

  type SuggestedHighlight {
    id: String!
    highlightedRange: WordRange!
    tags: [Tag]!
  }

  type PendingHighlight {
    id: String!
    timestamp: Date!
    tags: [Tag]!
  }

  type TranscriptWord {
    id: String!
    groupNumber: Int!
    wordNumber: Int!
    start: Float!
    end: Float!
    text: String!
  }

  type Participant {
    id: String!
    name: String!
  }

  type TranscriptGroup {
    id: String!
    groupNumber: Int!
    speaker: Participant!
    start: Float!
    end: Float!
    text: String!
    words: [TranscriptWord!]!
  }

  type Transcript {
    id: String
    isPending: Boolean
    groups: [TranscriptGroup]
  }

  type VideoProviderRecording {
    externalId: String!
    label: String
    startTime: String!
  }

  type VideoProviderRecordingList {
    totalCount: Int!
    totalPages: Int!
    nextPageCursor: String
    recordings: [VideoProviderRecording]
  }

  input TranscriptWordInput {
    groupNumber: Int!
    wordNumber: Int!
  }

  enum RoleType {
    admin
    member
  }

  type WorkspaceRole {
    userId: String!
    user: User!
    organizationId: String!
    type: RoleType!
  }

  type PendingInvite {
    id: String!
    email: String!
    role: RoleType!
  }

  type Workspace {
    id: String!
    name: String!
    currentUserInviteToken: String
    publicInterviewLinks: Boolean!
    roles: [WorkspaceRole!]!
    pendingInvites: [PendingInvite]!
    tags: [Tag]
    projects: [Project]!
  }

  type WorkspaceInvite {
    workspaceId: String!
    workspaceName: String!
    inviterName: String!
  }

  type User {
    id: String!
    fullName: String!
    email: String!
    workspaces: [Workspace!]!
    notificationPreferences: NotificationPreferences
    pendingWorkspaceInvites: [WorkspaceInvite]!
  }

  # Using a separate query and type to avodi N+1 lookups on the Tag type
  type TagHighlightCounts {
    tagId: String!
    highlightCount: Int!
  }

  enum TagColor {
    red
    orange
    yellow
    green
    indigo
    sky
    purple
  }

  type Tag {
    id: String!
    name: String!
    workspaceId: String!
    color: TagColor!
    isDefault: Boolean!
    emoji: String!
  }

  type NotificationPreferences {
    id: String!
    userId: String!
    notificationEmails: Boolean!
  }

  type UploadInterviewResponse {
    interviewId: String!
    uploadUrl: String!
  }

  type ProjectTag {
    id: String!
    tag: Tag!
    position: Int!
  }

  type Project {
    id: String!
    name: String!
    description: String!
    interviews: [Interview]!
    interviewCount: Int!
    interviewTags: [Tag]!
    highlightCounts: [TagHighlightCounts]!
    taglessHighlightCounts: Int!
    projectTags: [ProjectTag]!
  }

  enum RecordingStatus {
    pending
    recording
    done
  }

  type Mutation {
    importInterviewFromZoom(
      externalId: String!
      workspaceId: String!
    ): Interview
    addHighlight(
      interviewId: String!
      startWord: TranscriptWordInput!
      endWord: TranscriptWordInput!
      tagIds: [String!]
    ): Highlight!
    updateInterviewName(id: String!, name: String!): Interview!
    updateWorkspaceName(id: String!, name: String!): Workspace!
    addMemberToWorkspace(workspaceId: String!, memberId: String!): Workspace!
    createPendingInterview(
      zoomId: String!
      workspaceId: String!
      projectId: String
    ): Interview!
    recordInterview(
      zoomId: String!
      workspaceId: String!
      projectId: String
    ): Interview
    createTimestampHighlight(
      interviewId: String!
      timestamp: Date!
      tagId: String
    ): Interview!
    archiveInterview(interviewId: String!): Interview!
    updateSpeakerName(
      interviewId: String!
      speakerId: String!
      newName: String!
    ): Participant!
    updateHighlight(
      interviewId: String!
      highlightId: String!
      startTime: Int!
      endTime: Int!
    ): Highlight!
    createInviteToken(workspaceId: String!): String!
    updatePublicInterviewLinks(
      workspaceId: String!
      publicInterviewLinks: Boolean!
    ): Workspace!
    createTag(
      workspaceId: String!
      name: String!
      emoji: String!
      color: TagColor
      projectId: String
    ): Tag!
    addNewTagToHighlight(
      interviewId: String!
      highlightId: String!
      tagName: String!
      emoji: String!
      color: TagColor!
    ): Highlight!
    addTagToHighlight(
      interviewId: String!
      highlightId: String!
      tagId: String!
    ): Highlight!
    addTagsToHighlight(
      interviewId: String!
      highlightId: String!
      tagIds: [String!]!
    ): Highlight!
    removeTagsFromHighlight(
      interviewId: String!
      highlightId: String!
      tagIds: [String!]!
    ): Highlight!
    removeHighlight(interviewId: String!, highlightId: String!): Interview!
    updateTagName(tagId: String!, name: String!): Tag!
    updateTagColor(tagId: String!, color: TagColor!): Tag!
    updateTagEmoji(tagId: String!, emoji: String!): Tag!
    deleteTag(tagId: String!): Workspace!
    updateEmailPreference(
      notificationEmails: Boolean!
    ): NotificationPreferences!
    updateInterviewSummary(interviewId: String!, text: String!): Interview!
    createUploadUrl(
      workspaceId: String!
      interviewName: String!
      interviewDate: Date!
    ): UploadInterviewResponse!
    updateUserTagOrder(tagIds: [String!]!, workspaceId: String!): Workspace!
    approveSuggestedHighlight(
      interviewId: String!
      suggestedHighlightId: String!
    ): Interview!
    rejectSuggestedHighlight(
      interviewId: String!
      suggestedHighlightId: String!
    ): Interview!
    createProject(
      workspaceId: String!
      name: String!
      description: String!
    ): Project!
    moveInterviewsToProject(
      projectId: String!
      interviewIds: [String!]!
    ): Project!
    removeInterviewFromProject(interviewId: String!): Interview!
    updateProject(
      projectId: String!
      name: String
      description: String
    ): Project!
    addProjectTagToProject(projectId: String!, tagId: String!): Project!
    removeProjectTagFromProject(projectId: String!, tagId: String!): Project!
    updateProjectTagPositions(projectId: String!, tagIds: [String!]!): Project!
    sendInviteEmail(workspaceId: String!, email: String!): Workspace!
    acceptInvite(workspaceId: String!): User!
    rejectInvite(workspaceId: String!): User!
    stopRecording(meetingId: String!): Boolean!
  }

  type Query {
    interview(id: String!): Interview!
    highlight(id: String!): Highlight!
    listInterviews(workspaceId: String!, projectId: String): [Interview]
    isConnectedToZoom: Boolean!
    zoomRecordingList: VideoProviderRecordingList
    me: User
    workspace(id: String!): Workspace
    searchUsersByEmail(emailQuery: String!): [User]
    getPendingInterview(externalId: String!): Interview
    getPendingInterviewByRecordingTarget(externalId: String!): Interview
    getTagHighlightCounts(workspaceId: String!): [TagHighlightCounts]!
    getTaglessHighlightCounts(workspaceId: String!): Int!
    getHighlightsForTag(tagId: String!, projectId: String): [Highlight]!
    getHighlightsWithoutTag(
      workspaceId: String!
      projectId: String
    ): [Highlight]!
    project(id: String!): Project!
    recordingStatus(meetingId: String!): RecordingStatus
  }
`;
