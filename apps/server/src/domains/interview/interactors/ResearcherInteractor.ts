/*
 * ResearcherInteractor
 *
 * Responsible for all actions that a researcher would perform
 * on an interview. This includes adding highlights and tags
 * after the interview has been completed.
 */
import { AdminInteractor } from "@root/domains/auth/interactors/Admin";
import { MemberInteractor } from "@root/domains/auth/interactors/Member";
import { EditorInteractor } from "@root/domains/video/interactors/EditorInteractor";
import { Logger } from "@root/global/logger";
import { randomUUID } from "crypto";
import { prop } from "remeda";
import { inject, injectable } from "tsyringe";
import {
  addTagsToHighlightOnInterview,
  addTagToHighlightOnInterview,
  addVideoToHighlightOnInterview,
  createHighlightOnInterviewTranscript,
  Interview,
  interviewHasSpeaker,
  isInterview,
  removeHighlightOnInterview,
  removeTagsFromHighlightOnInterview,
  updateHighlightOnInterview,
} from "../entities/Interview";
import { addProjectTag } from "../entities/Project";
import {
  Tag,
  TagColor,
  updateTagColor,
  updateTagName,
  pickRandomTagColor,
  defaultTags,
  createTag,
  updateTagEmoji,
} from "../entities/Tag";
import { orderTagsBasedOnPreferences } from "../entities/UserTagPreferences";
import { InteractorRepositories } from "./InteractorRepositories";
import { PreferenceCustomizationInteractor } from "./PreferenceCustomizationInteractor";
import { serializeHighlight } from "./serializers/SerializedHighlight";
import {
  deserializeInterview,
  serializeInterview,
} from "./serializers/SerializedInterview";
import { deserializeTag, serializeTag } from "./serializers/SerializedTag";
import {
  serializeTranscript,
  TranscriptWordId,
} from "./serializers/SerializedTranscript";

@injectable()
export class ResearcherInteractor {
  constructor(
    @inject("Repositories") private repositories: InteractorRepositories,
    private admin: AdminInteractor,
    private member: MemberInteractor,
    private editor: EditorInteractor,
    private preferenceCustomizer: PreferenceCustomizationInteractor,
    @inject("Logger") private logger: Logger
  ) {}

  ensureUserIsResearcher = async (
    userId: string,
    interviewId: string
  ): Promise<void> => {
    const interview =
      await this.repositories.interviews.getInterviewWithoutTranscript(
        interviewId
      );

    if (!(await this.admin.canEditWorkspace(userId, interview.workspaceId))) {
      throw new Error("workspace not found");
    }
    return;
  };

  ensureUserIsResearcherWithTag = async (
    userId: string,
    tagId: string
  ): Promise<void> => {
    const tag = await this.repositories.tags.getTagById(tagId);

    if (!(await this.admin.canEditWorkspace(userId, tag.workspaceId))) {
      throw new Error("workspace not found");
    }
    return;
  };

  getTagsForWorkspace = async (id: string, userId?: string) => {
    const tags = await this.repositories.tags.getTagsForWorkspace(id);
    if (!userId) {
      return tags;
    }

    const preferences = await this.preferenceCustomizer.getTagPreferences(
      userId
    );

    return orderTagsBasedOnPreferences(preferences, tags);
  };

  createClipFromHighlight = async (
    interview: Interview,
    highlightId: string
  ) => {
    const highlight = interview.highlights.find(
      (highlight) => highlight.id === highlightId
    );
    if (!highlight) {
      throw new Error("highlight not found");
    }

    const video = await this.editor.createClip(
      interview.recordingId,
      highlight.highlightedRange.startWord.start,
      highlight.highlightedRange.endWord.end
    );

    const { interview: updatedInterview, highlight: updatedHighlight } =
      addVideoToHighlightOnInterview(interview, highlightId, video.id);

    await this.repositories.interviews.addVideoToHighlight(
      updatedHighlight.id,
      video.id
    );

    return { interview: updatedInterview, highlight: updatedHighlight };
  };

  highlightTranscript = async (
    interviewId: string,
    startWord: TranscriptWordId,
    endWord: TranscriptWordId,
    tagIds?: string[] | null
  ) => {
    const initialInterview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(initialInterview)) {
      throw new Error(
        "cannot create a highlight on transcript before transcript is ready"
      );
    }

    const tags: Tag[] =
      tagIds && tagIds?.length > 0
        ? await Promise.all(tagIds.map(this.repositories.tags.getTagById))
        : [];

    const [interview, highlight] = createHighlightOnInterviewTranscript(
      initialInterview,
      startWord,
      endWord,
      tags
    );

    await this.repositories.interviews.addHighlight({
      interviewId: interview.id,
      interviewTranscriptId: interview.transcript.id,
      id: highlight.id,
      highlightedRange: highlight.highlightedRange,
      tags: highlight.tags,
      transcript: serializeTranscript(highlight.transcript),
      originSuggestionId: highlight.originSuggestionId,
    });

    const { highlight: updatedHighlight } = await this.createClipFromHighlight(
      interview,
      highlight.id
    );

    return serializeHighlight(updatedHighlight);
  };

  archiveInterview = async (interviewId: string) => {
    return this.repositories.interviews
      .archive(interviewId)
      .then(deserializeInterview)
      .then(serializeInterview);
  };

  updateSpeakerName = async (
    interviewId: string,
    speakerId: string,
    newName: string
  ) => {
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(interview) || !interviewHasSpeaker(interview, speakerId)) {
      throw new Error("workspace not found");
    }

    return this.repositories.participants.updateName(speakerId, newName);
  };

  updateHighlight = async (
    interviewId: string,
    highlightId: string,
    startTime: number,
    endTime: number
  ) => {
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(interview)) {
      throw new Error(
        "Invalid interview. Interview is not ready to be edit highlights."
      );
    }

    const { highlight, interview: updatedInterview } =
      updateHighlightOnInterview(interview, highlightId, startTime, endTime);

    await this.repositories.interviews.updateHighlight({
      interviewId,
      highlightId,
      startWord: highlight.highlightedRange.startWord,
      endWord: highlight.highlightedRange.endWord,
      transcript: serializeTranscript(highlight.transcript),
    });

    if (!highlight.videoId) {
      // this means the interview's editable asset is not ready yet
      return serializeHighlight(highlight);
    }

    const { highlight: highlightWithClip } = await this.createClipFromHighlight(
      updatedInterview,
      highlight.id
    );

    return serializeHighlight(highlightWithClip);
  };

  createTag = async ({
    workspaceId,
    name,
    color,
    projectId,
    emoji,
  }: {
    workspaceId: string;
    name: string;
    emoji: string;
    color?: TagColor;
    projectId: string | null;
  }) => {
    const tag: Tag = createTag({
      workspaceId,
      name,
      id: randomUUID(),
      color: color || pickRandomTagColor(),
      emoji,
    });

    await this.repositories.tags.create(serializeTag(tag));

    if (projectId) {
      const project = await this.repositories.projects.getProjectById(
        projectId
      );

      if (project.workspaceId !== workspaceId) {
        throw new Error("project not found");
      }

      const { projectTag } = addProjectTag(project, tag);

      await this.repositories.projects.addProjectTagToProject(
        project.id,
        projectTag
      );
    }

    return serializeTag(tag);
  };

  addNewTagToHighlight = async (
    interviewId: string,
    highlightId: string,
    tagName: string,
    tagEmoji: string,
    tagColor: TagColor
  ) => {
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(interview)) {
      throw new Error("cannot add tags to pending interviews");
    }

    const tag = await this.createTag({
      workspaceId: interview.workspaceId,
      name: tagName,
      color: tagColor,
      projectId: null,
      emoji: tagEmoji,
    }).then(deserializeTag);

    const event = addTagToHighlightOnInterview(interview, highlightId, tag);

    await this.repositories.interviews.addTagToHighlight(
      event.highlight.id,
      event.newTag.id
    );

    return serializeHighlight(event.highlight);
  };

  addTagToHighlight = async (
    interviewId: string,
    tagId: string,
    highlightId: string
  ) => {
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(interview)) {
      throw new Error("cannot add tags to pending interviews");
    }

    const tag = await this.repositories.tags
      .getTagById(tagId)
      .then(deserializeTag);

    const event = addTagToHighlightOnInterview(interview, highlightId, tag);

    await this.repositories.interviews.addTagToHighlight(
      event.highlight.id,
      event.newTag.id
    );

    return serializeHighlight(event.highlight);
  };

  addTagsToHighlight = async (
    interviewId: string,
    tagIds: string[],
    highlightId: string
  ) => {
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(interview)) {
      throw new Error("cannot add tags to pending interviews");
    }

    const tags = await this.repositories.tags
      .getManyById(tagIds)
      .then((tags) => tags.map(deserializeTag));

    const event = addTagsToHighlightOnInterview(interview, highlightId, tags);

    await this.repositories.interviews.addTagsToHighlight(
      event.highlight.id,
      event.newTags.map(prop("id"))
    );

    return serializeHighlight(event.highlight);
  };

  removeTagsFromHighlight = async (
    interviewId: string,
    tagIds: string[],
    highlightId: string
  ) => {
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(interview)) {
      throw new Error("cannot remove tags from pending interviews");
    }

    const tags = await this.repositories.tags
      .getManyById(tagIds)
      .then((tags) => tags.map(deserializeTag));

    const event = removeTagsFromHighlightOnInterview(
      interview,
      highlightId,
      tags
    );

    await this.repositories.interviews.removeTagsFromHighlight(
      event.highlight.id,
      event.removedTags.map(prop("id"))
    );

    return serializeHighlight(event.highlight);
  };

  removeHighlight = async (interviewId: string, highlightId: string) => {
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(interview)) {
      throw new Error("cannot remove highlights from  pending interviews");
    }

    const event = removeHighlightOnInterview(interview, highlightId);

    if (event === null) {
      return serializeInterview(interview);
    }

    await this.repositories.interviews.removeHighlight(
      event.removedHighlight.id,
      event.removedHighlight.tags.map(prop("id"))
    );

    return serializeInterview(event.interview);
  };

  updateTagName = async (tagId: string, name: string) => {
    let tag = await this.repositories.tags
      .getTagById(tagId)
      .then(deserializeTag);

    tag = updateTagName(tag, name);

    await this.repositories.tags.updateTagName(tag.id, tag.name);

    return serializeTag(tag);
  };

  updateTagColor = async (tagId: string, color: TagColor) => {
    let tag = await this.repositories.tags
      .getTagById(tagId)
      .then(deserializeTag);

    tag = updateTagColor(tag, color);

    await this.repositories.tags.updateTagColor(tag.id, tag.color);

    return serializeTag(tag);
  };

  updateTagEmoji = async (tagId: string, emoji: string) => {
    let tag = await this.repositories.tags
      .getTagById(tagId)
      .then(deserializeTag);

    tag = updateTagEmoji(tag, emoji);

    await this.repositories.tags.updateTagEmoji(tag.id, tag.emoji);

    return serializeTag(tag);
  };

  deleteTag = async (tagId: string) => {
    const tag = await this.repositories.tags
      .getTagById(tagId)
      .then(deserializeTag);

    if (tag.isDefault) {
      throw new Error("cannot delete default tags");
    }

    await this.repositories.interviews.removeTagFromHighlights(tag.id);
    await this.repositories.tags.deleteTag(tag.id);

    return this.member.getWorkspace(tag.workspaceId);
  };

  getTagHighlightCounts = async (workspaceId: string) => {
    const result = await this.repositories.tags.getHighlightCounts(workspaceId);

    return result.map(({ id, highlights }) => ({
      tagId: id,
      highlightCount: highlights.length,
    }));
  };

  getTaglessHighlightCounts = async (workspaceId: string) => {
    const result = await this.repositories.tags.getTaglessHighlightCount(
      workspaceId
    );

    return result.length;
  };

  handleNewWorkspace = async (workspaceId: string) => {
    this.logger.info("creating default tags for workspace", { workspaceId });
    const currentTags = await this.repositories.tags.getTagsForWorkspace(
      workspaceId
    );

    if (currentTags.length > 0) {
      return;
    }

    const tags: Tag[] = defaultTags.map((tagDefault) => ({
      ...tagDefault,
      description: tagDefault.description || null,
      autoExtract: tagDefault.autoExtract || false,
      id: randomUUID(),
      workspaceId,
      isDefault: true,
    }));

    await this.repositories.tags.createMany(tags.map(serializeTag));
  };
}
