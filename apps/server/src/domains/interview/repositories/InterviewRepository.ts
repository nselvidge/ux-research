import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import { AddTimestampHighlightEvent } from "../entities/Interview";

import {
  AddHighlightEvent,
  InteractorInterviewRepository,
} from "../interactors/InteractorRepositories";
import { MinimalSerializedInterview } from "../interactors/serializers/SerializedInterview";
import { PersistenceSummary } from "../interactors/serializers/SerializedInterviewSummary";
import { MinimalSerializedTranscript } from "../interactors/serializers/SerializedTranscript";
import { MinimalSerializedWordRange } from "../interactors/serializers/SerializedWordRange";

@injectable()
export class InterviewRepository implements InteractorInterviewRepository {
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}
  private readonly defaultInclude = {
    source: true,
    transcript: { include: { groups: { include: { words: true } } } },
    highlights: {
      include: {
        highlightedRange: { include: { startWord: true, endWord: true } },
        tags: true,
        transcript: { include: { groups: { include: { words: true } } } },
      },
    },
    suggestedHighlights: {
      include: {
        highlightedRange: { include: { startWord: true, endWord: true } },
        tags: true,
        transcript: { include: { groups: { include: { words: true } } } },
      },
    },
    summary: true,
  };

  getInterviewsByProjectId = async (id: string) =>
    this.prisma.interview.findMany({
      where: { projectId: id, archived: false },
      include: this.defaultInclude,
    });

  maybeGetInterviewById = async (id: string) =>
    this.prisma.interview.findUnique({
      where: { id },
      include: this.defaultInclude,
    });

  addSummary = async (interviewId: string, summary: PersistenceSummary) =>
    this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        summary: {
          create: {
            id: summary.id,
            text: summary.text,
            generatedText: summary.generatedText,
            touched: summary.touched,
          },
        },
      },
      include: this.defaultInclude,
    });

  getUnarchivedForWorkspace = async (
    workspaceId: string,
    projectId?: string | null
  ) =>
    this.prisma.interview.findMany({
      where: { workspaceId, archived: false, projectId },
      include: {
        highlights: true,
      },
    });

  createInterview = async (interview: MinimalSerializedInterview) =>
    this.prisma.interview.create({
      data: {
        id: interview.id,
        name: interview.name,
        date: interview.date,
        workspaceId: interview.workspaceId,
        creatorId: interview.creatorId,
        source: interview.source
          ? {
              create: {
                sourceId: interview.source.sourceId,
                platform: interview.source.platform,
              },
            }
          : undefined,
        recordingId: interview.recordingId,
        projectId: interview.projectId,
      },
      include: this.defaultInclude,
    });

  addHighlightTranscript = async (
    highlightId: string,
    { startWord, endWord }: MinimalSerializedWordRange,
    transcript: MinimalSerializedTranscript
  ) => {
    return this.prisma.highlight.update({
      where: { id: highlightId },
      data: {
        highlightedRange: {
          create: {
            transcriptId: startWord.transcriptId,
            startWordNumber: startWord.wordNumber,
            startGroupNumber: startWord.groupNumber,
            endWordNumber: endWord.wordNumber,
            endGroupNumber: endWord.groupNumber,
          },
        },
        transcript: {
          create: {
            id: transcript.id,
            isPending: false,
            groups: {
              create: transcript.groups.map((group) => ({
                groupNumber: group.groupNumber,
                speaker: { connect: { id: group.speakerId } },
                words: {
                  create: group.words.map((word) => ({
                    wordNumber: word.wordNumber,
                    text: word.text,
                    start: word.start,
                    end: word.end,
                  })),
                },
                text: group.text,
              })),
            },
          },
        },
      },
      include: {
        highlightedRange: { include: { startWord: true, endWord: true } },
        tags: true,
        transcript: { include: { groups: { include: { words: true } } } },
      },
    });
  };

  addRecording = async (
    interview: MinimalSerializedInterview,
    recordingId: string
  ) =>
    this.prisma.interview.update({
      where: { id: interview.id },
      data: {
        name: interview.name,
        date: interview.date,
        recordingId,
      },
      include: this.defaultInclude,
    });

  getInterviewById = async (id: string) =>
    this.prisma.interview.findUniqueOrThrow({
      where: { id },
      include: this.defaultInclude,
    });

  getInterviewWithoutTranscript = async (id: string) =>
    this.prisma.interview.findUniqueOrThrow({
      where: { id },
      include: {
        source: true,
        highlights: {
          include: {
            highlightedRange: { include: { startWord: true, endWord: true } },
            tags: true,
            transcript: { include: { groups: { include: { words: true } } } },
          },
        },
        suggestedHighlights: {
          include: {
            highlightedRange: { include: { startWord: true, endWord: true } },
            tags: true,
            transcript: { include: { groups: { include: { words: true } } } },
          },
        },
      },
    });

  addHighlight = async ({
    interviewId,
    interviewTranscriptId,
    id,
    highlightedRange: { startWord, endWord },
    tags,
    transcript,
    originSuggestionId,
  }: AddHighlightEvent) => {
    return this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        highlights: {
          create: {
            id,
            originSuggestion:
              originSuggestionId !== null
                ? {
                    connect: { id: originSuggestionId },
                  }
                : undefined,
            tags: {
              connect: tags.map(({ id: tagId }) => ({ id: tagId })),
            },
            highlightedRange: {
              create: {
                transcriptId: interviewTranscriptId,
                startWordNumber: startWord.wordNumber,
                startGroupNumber: startWord.groupNumber,
                endWordNumber: endWord.wordNumber,
                endGroupNumber: endWord.groupNumber,
              },
            },
            transcript: {
              create: {
                id: transcript.id,
                isPending: false,
                groups: {
                  create: transcript.groups.map((group) => ({
                    groupNumber: group.groupNumber,
                    speaker: { connect: { id: group.speakerId } },
                    words: {
                      create: group.words.map((word) => ({
                        wordNumber: word.wordNumber,
                        text: word.text,
                        start: word.start,
                        end: word.end,
                      })),
                    },
                    text: group.text,
                  })),
                },
              },
            },
          },
        },
      },
      include: this.defaultInclude,
    });
  };

  addTimestampHighlight = async ({
    interviewId,
    highlight: { id, timestamp, tagIds },
  }: AddTimestampHighlightEvent) =>
    this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        highlights: {
          create: {
            id,
            timestamp: timestamp,
            tags: {
              connect: tagIds.map((id) => ({ id })),
            },
          },
        },
      },
      include: this.defaultInclude,
    });

  updateName = async (id: string, name: string) =>
    this.prisma.interview.update({
      where: { id },
      data: { name },
      include: this.defaultInclude,
    });

  archive = async (id: string) =>
    this.prisma.interview.update({
      where: { id },
      data: { archived: true },
      include: this.defaultInclude,
    });

  updateHighlight = async ({
    highlightId,
    startWord,
    endWord,
    transcript,
  }: {
    highlightId: string;
    startWord: { wordNumber: number; groupNumber: number };
    endWord: { wordNumber: number; groupNumber: number };
    transcript: MinimalSerializedTranscript;
  }) => {
    return this.prisma.highlight.update({
      where: { id: highlightId },
      data: {
        highlightedRange: {
          update: {
            startWordNumber: startWord.wordNumber,
            startGroupNumber: startWord.groupNumber,
            endWordNumber: endWord.wordNumber,
            endGroupNumber: endWord.groupNumber,
          },
        },
        transcript: {
          create: {
            id: transcript.id,
            isPending: false,
            groups: {
              create: transcript.groups.map((group) => ({
                groupNumber: group.groupNumber,
                speaker: { connect: { id: group.speakerId } },
                text: group.text,
                words: {
                  create: group.words.map((word) => ({
                    wordNumber: word.wordNumber,
                    text: word.text,
                    start: word.start,
                    end: word.end,
                  })),
                },
              })),
            },
          },
        },
      },
      include: {
        highlightedRange: {
          include: { startWord: true, endWord: true },
        },
        transcript: { include: { groups: { include: { words: true } } } },
        tags: true,
      },
    });
  };
  getWorkspaceIdForHighlight = async (id: string) =>
    (
      await this.prisma.highlight.findUniqueOrThrow({
        where: { id },
        include: {
          interview: {
            select: { workspaceId: true },
          },
        },
      })
    ).interview.workspaceId;

  getHighlight = async (id: string) =>
    await this.prisma.highlight.findUniqueOrThrow({
      where: { id },
      include: {
        highlightedRange: {
          include: { startWord: true, endWord: true },
        },
        transcript: { include: { groups: { include: { words: true } } } },
        tags: true,
      },
    });

  getInterviewByTranscriptId = async (transcriptId: string) => {
    const transcript = await this.prisma.transcript.findUniqueOrThrow({
      where: { id: transcriptId },
      include: { interview: { include: this.defaultInclude } },
    });

    if (!transcript.interview) {
      throw new Error("Transcript has no interview");
    }

    return transcript.interview;
  };

  addTagToHighlight = async (highlightId: string, tagId: string) =>
    this.prisma.highlight.update({
      where: { id: highlightId },
      data: { tags: { connect: { id: tagId } } },
      include: {
        highlightedRange: { include: { startWord: true, endWord: true } },
        tags: true,
        transcript: { include: { groups: { include: { words: true } } } },
      },
    });

  addTagsToHighlight = async (highlightId: string, tagIds: string[]) =>
    this.prisma.highlight.update({
      where: { id: highlightId },
      data: {
        tags: {
          connect: tagIds.map((id) => ({
            id,
          })),
        },
      },
      include: {
        highlightedRange: { include: { startWord: true, endWord: true } },
        tags: true,
        transcript: { include: { groups: { include: { words: true } } } },
      },
    });

  removeTagsFromHighlight = async (highlightId: string, tagIds: string[]) =>
    this.prisma.highlight.update({
      where: { id: highlightId },
      data: {
        tags: {
          disconnect: tagIds.map((id) => ({
            id,
          })),
        },
      },
      include: {
        highlightedRange: { include: { startWord: true, endWord: true } },
        tags: true,
        transcript: { include: { groups: { include: { words: true } } } },
      },
    });

  removeHighlight = async (highlightId: string, tagIds: string[]) => {
    if (tagIds.length > 0) {
      await this.prisma.highlight.update({
        where: { id: highlightId },
        data: { tags: { disconnect: tagIds.map((id) => ({ id })) } },
      });
    }
    await this.prisma.highlight.delete({ where: { id: highlightId } });
  };

  removeTagFromHighlights = async (tagId: string) => {
    const tag = await this.prisma.tag.findUniqueOrThrow({
      where: { id: tagId },
      include: { highlights: { select: { id: true } } },
    });

    if (tag.highlights.length > 0) {
      await this.prisma.tag.update({
        where: { id: tagId },
        data: {
          highlights: { disconnect: tag.highlights.map(({ id }) => ({ id })) },
        },
      });
    }
  };

  maybeGetPendingInterview = async (sourceId: string) =>
    this.prisma.interview.findFirst({
      where: {
        source: { sourceId },
      },
      include: this.defaultInclude,
    });

  addVideoToHighlight = async (highlightId: string, videoId: string) =>
    this.prisma.highlight.update({
      where: { id: highlightId },
      data: { video: { connect: { id: videoId } } },
      include: {
        highlightedRange: { include: { startWord: true, endWord: true } },
        tags: true,
        transcript: { include: { groups: { include: { words: true } } } },
      },
    });

  getInterviewByHighlightId = async (highlightId: string) =>
    (
      await this.prisma.highlight.findUniqueOrThrow({
        where: { id: highlightId },
        include: { interview: { include: this.defaultInclude } },
      })
    ).interview;

  getNonPendingHighlightByTagId = async (
    tagId: string,
    projectId?: string | null
  ) =>
    (
      await this.prisma.tag.findUniqueOrThrow({
        where: { id: tagId },
        include: {
          highlights: {
            include: {
              highlightedRange: { include: { startWord: true, endWord: true } },
              tags: true,
              transcript: { include: { groups: { include: { words: true } } } },
              interview: {
                select: { id: true, createdAt: true, name: true },
              },
            },
            orderBy: { interview: { createdAt: "desc" } },
            where: {
              transcriptId: { not: null },
              interview: { archived: false, projectId },
              videoId: { not: null },
            },
          },
        },
      })
    ).highlights;

  getNonPendingTaglessHighlights = async (
    workspaceId: string,
    projectId?: string | null
  ) =>
    this.prisma.highlight.findMany({
      where: {
        interview: { workspaceId, archived: false, projectId },
        transcriptId: { not: null },
        videoId: { not: null },
        tags: {
          none: {},
        },
      },
      orderBy: { interview: { createdAt: "desc" } },
      include: {
        highlightedRange: { include: { startWord: true, endWord: true } },
        tags: true,
        transcript: { include: { groups: { include: { words: true } } } },
        interview: {
          select: { id: true, createdAt: true, name: true },
        },
      },
    });

  getInterviewByVideoId = async (recordingId: string) =>
    this.prisma.interview.findFirst({
      where: { recordingId },
      include: this.defaultInclude,
    });

  updateSummary = async (interviewId: string, summary: PersistenceSummary) =>
    this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        summary: {
          update: {
            text: summary.text,
            generatedText: summary.generatedText,
            touched: summary.touched,
          },
        },
      },
      include: this.defaultInclude,
    });

  getStaleInterviewsPendingRecording = async () =>
    this.prisma.interview.findMany({
      where: {
        createdAt: { lt: new Date(Date.now() - 1000 * 60 * 30) },
        archived: false,
        recordingId: null,
        recordingError: null,
      },
      include: this.defaultInclude,
    });

  updateInterviewProject = async (
    interviewId: string,
    projectId: string | null
  ) =>
    this.prisma.interview.update({
      where: { id: interviewId },
      data: { projectId },
      include: this.defaultInclude,
    });

  getInterviewCountByProjectId = async (projectId: string) =>
    this.prisma.interview.count({
      where: { projectId, archived: false },
    });

  getWorkspaceStats = async (workspaceId: string) => ({
    interviewCount: await this.prisma.interview.count({
      where: { workspaceId, archived: false },
    }),
    highlightCount: await this.prisma.highlight.count({
      where: { interview: { workspaceId, archived: false } },
    }),
  });
}
