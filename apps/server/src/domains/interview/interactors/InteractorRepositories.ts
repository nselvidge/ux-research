import { PersistenceWorkspace } from "@root/domains/auth/interactors/serializers/SerializedWorkspace";
import {
  AddTimestampHighlightEvent,
  InterviewSourcePlatform,
} from "../entities/Interview";
import { TagColor } from "../entities/Tag";
import { MinimalSerializedHighlight } from "./serializers/SerializedHighlight";
import {
  InterviewListItem,
  InterviewWithoutTranscript,
  MinimalSerializedInterview,
} from "./serializers/SerializedInterview";
import { PersistenceSummary } from "./serializers/SerializedInterviewSummary";
import { SerializedParticipant } from "./serializers/SerializedParticipant";
import { PersistenceProject } from "./serializers/SerializedProject";
import { PersistenceSuggestedHighlight } from "./serializers/SerializedSuggestedHighlight";
import { PersistenceTag } from "./serializers/SerializedTag";
import { MinimalSerializedTranscript } from "./serializers/SerializedTranscript";
import { MinimalSerializedWordRange } from "./serializers/SerializedWordRange";

export interface AddHighlightEvent {
  interviewId: string;
  interviewTranscriptId: string;
  id: string;
  highlightedRange: {
    startWord: { wordNumber: number; groupNumber: number };
    endWord: { wordNumber: number; groupNumber: number };
  };
  tags: { id: string }[];
  transcript: MinimalSerializedTranscript;
  originSuggestionId: string | null;
}

export interface InteractorInterviewRepository {
  getWorkspaceStats: (
    workspaceId: string
  ) => Promise<{ interviewCount: number; highlightCount: number }>;

  getInterviewsByProjectId: (
    id: string
  ) => Promise<MinimalSerializedInterview[]>;
  getInterviewByHighlightId: (
    id: string
  ) => Promise<MinimalSerializedInterview>;
  getInterviewById: (id: string) => Promise<MinimalSerializedInterview>;
  getInterviewWithoutTranscript: (
    id: string
  ) => Promise<InterviewWithoutTranscript>;
  getUnarchivedForWorkspace: (
    workspaceId: string,
    projectId?: string | null
  ) => Promise<InterviewListItem[]>;
  createInterview: (
    interview: MinimalSerializedInterview
  ) => Promise<MinimalSerializedInterview>;
  addRecording: (
    interview: MinimalSerializedInterview,
    recordingId: string
  ) => Promise<MinimalSerializedInterview>;
  addHighlight: (
    event: AddHighlightEvent
  ) => Promise<MinimalSerializedInterview>;
  addTimestampHighlight: (
    event: AddTimestampHighlightEvent
  ) => Promise<MinimalSerializedInterview>;
  updateName: (
    interviewId: string,
    nextName: string
  ) => Promise<MinimalSerializedInterview>;
  updateInterviewProject: (
    interviewId: string,
    projectId: string | null
  ) => Promise<MinimalSerializedInterview>;
  addHighlightTranscript: (
    highlightId: string,
    wordRange: MinimalSerializedWordRange,
    transcript: MinimalSerializedTranscript
  ) => Promise<MinimalSerializedHighlight>;
  archive: (interviewId: string) => Promise<MinimalSerializedInterview>;
  updateHighlight: (message: {
    interviewId: string;
    highlightId: string;
    startWord: { groupNumber: number; wordNumber: number };
    endWord: { groupNumber: number; wordNumber: number };
    transcript: MinimalSerializedTranscript;
  }) => Promise<MinimalSerializedHighlight>;
  getWorkspaceIdForHighlight: (highlightId: string) => Promise<string>;
  getHighlight: (highlightId: string) => Promise<MinimalSerializedHighlight>;
  getInterviewByTranscriptId: (
    transcriptId: string
  ) => Promise<MinimalSerializedInterview>;
  addTagToHighlight: (
    highlightId: string,
    tagId: string
  ) => Promise<MinimalSerializedHighlight>;
  addTagsToHighlight: (
    highlightId: string,
    tagIds: string[]
  ) => Promise<MinimalSerializedHighlight>;
  removeTagsFromHighlight: (
    highlightId: string,
    tagIds: string[]
  ) => Promise<MinimalSerializedHighlight>;
  removeHighlight: (highlightId: string, tagIds: string[]) => Promise<void>;
  removeTagFromHighlights: (tagId: string) => Promise<void>;
  maybeGetPendingInterview: (
    sourceId: string,
    platform: InterviewSourcePlatform
  ) => Promise<MinimalSerializedInterview | null>;
  addVideoToHighlight: (
    highlightId: string,
    videoId: string
  ) => Promise<MinimalSerializedHighlight>;
  getNonPendingHighlightByTagId: (
    tagId: string,
    projectId?: string | null
  ) => Promise<MinimalSerializedHighlight[]>;
  getInterviewByVideoId: (
    videoId: string
  ) => Promise<MinimalSerializedInterview | null>;
  addSummary: (
    interviewId: string,
    summary: PersistenceSummary
  ) => Promise<MinimalSerializedInterview>;
  updateSummary: (
    interviewId: string,
    summary: PersistenceSummary
  ) => Promise<MinimalSerializedInterview>;
  maybeGetInterviewById: (
    interviewId: string
  ) => Promise<MinimalSerializedInterview | null>;
  getStaleInterviewsPendingRecording: () => Promise<
    MinimalSerializedInterview[]
  >;
  getNonPendingTaglessHighlights: (
    workspaceId: string,
    projectId?: string | null
  ) => Promise<MinimalSerializedHighlight[]>;
  getInterviewCountByProjectId: (projectId: string) => Promise<number>;
}

export interface ProjectRepository {
  createProject: (
    workspaceId: string,
    project: PersistenceProject
  ) => Promise<void>;
  getProjectById: (projectId: string) => Promise<PersistenceProject>;
  updateProject: (
    projectId: string,
    { name, description }: { name?: string; description?: string }
  ) => Promise<void>;
  addProjectTagToProject: (
    projectId: string,
    projectTag: {
      tagId: string;
      position: number;
    }
  ) => Promise<void>;
  removeProjectTagFromProject: (
    projectId: string,
    projectTags: { tagId: string; position: number }[],
    tagId: string
  ) => Promise<void>;
  updateProjectTagPositions: (
    projectId: string,
    projectTags: { tagId: string; position: number }[]
  ) => Promise<void>;
}

export interface InteractorParticipantRepository {
  addParticipants: (
    participants: SerializedParticipant[]
  ) => Promise<SerializedParticipant[]>;
  getById: (participantId: string) => Promise<SerializedParticipant>;
  updateName: (id: string, name: string) => Promise<SerializedParticipant>;
}

export interface InteractorTagRepository {
  create: (tag: PersistenceTag) => Promise<PersistenceTag>;
  createMany: (tags: PersistenceTag[]) => Promise<void>;
  getTagById: (id: string) => Promise<PersistenceTag>;
  getTagsForWorkspace: (workspaceId: string) => Promise<PersistenceTag[]>;
  getManyById: (ids: string[]) => Promise<PersistenceTag[]>;
  updateTagName: (id: string, name: string) => Promise<PersistenceTag>;
  updateTagColor: (id: string, color: TagColor) => Promise<PersistenceTag>;
  updateTagEmoji: (id: string, emoji: string) => Promise<PersistenceTag>;
  deleteTag: (id: string) => Promise<PersistenceTag>;
  getHighlightCounts: (
    workspaceId: string
  ) => Promise<{ id: string; highlights: { id: string }[] }[]>;
  getWorkspaceIdForTag: (tagId: string) => Promise<string>;
  getTaglessHighlightCount: (workspaceId: string) => Promise<{ id: string }[]>;
  getTagsForProject: (projectId: string) => Promise<PersistenceTag[]>;
  getProjectHighlightCounts: (
    projectId: string
  ) => Promise<{ id: string; highlights: { id: string }[] }[]>;
  getProjectTaglessHighlightCounts: (
    projectId: string
  ) => Promise<{ id: string }[]>;
}

export interface InteractorTranscriptRepository {
  createTranscriptForInterview: (
    interviewId: string,
    transcript: MinimalSerializedTranscript
  ) => Promise<MinimalSerializedTranscript>;
  addGroups(
    transcript: MinimalSerializedTranscript
  ): Promise<MinimalSerializedTranscript>;
}

export interface InteractorSuggestedHighlightRepository {
  createSuggestedHighlight: (
    interviewId: string,
    interviewTranscriptId: string,
    suggestedHighlight: PersistenceSuggestedHighlight
  ) => Promise<PersistenceSuggestedHighlight>;
  updateSuggestedHighlightStatus: (
    id: string,
    status: "approved" | "pending" | "rejected"
  ) => Promise<PersistenceSuggestedHighlight>;
}

export interface WorkspaceRepository {
  getWorkspaceById: (workspaceId: string) => Promise<PersistenceWorkspace>;
  getWorkspaceByProjectId: (projectId: string) => Promise<PersistenceWorkspace>;
}

export interface InteractorRepositories {
  interviews: InteractorInterviewRepository;
  transcripts: InteractorTranscriptRepository;
  participants: InteractorParticipantRepository;
  tags: InteractorTagRepository;
  suggestedHighlights: InteractorSuggestedHighlightRepository;
  projects: ProjectRepository;
  workspaces: WorkspaceRepository;
}
