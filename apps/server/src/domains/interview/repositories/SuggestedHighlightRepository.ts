import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import { InteractorSuggestedHighlightRepository } from "../interactors/InteractorRepositories";
import { PersistenceSuggestedHighlight } from "../interactors/serializers/SerializedSuggestedHighlight";

@injectable()
export class SuggestedHighlightRepository
  implements InteractorSuggestedHighlightRepository
{
  defaultIncludes = {
    highlightedRange: {
      include: {
        startWord: true,
        endWord: true,
      },
    },
    transcript: {
      include: {
        groups: {
          include: {
            words: true,
          },
        },
      },
    },
    tags: true,
  };

  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

  createSuggestedHighlight = async (
    interviewId: string,
    interviewTranscriptId: string,
    suggestedHighlight: PersistenceSuggestedHighlight
  ) =>
    this.prisma.suggestedHighlight.create({
      data: {
        id: suggestedHighlight.id,
        status: suggestedHighlight.status,
        interview: {
          connect: {
            id: interviewId,
          },
        },
        tags: {
          connect: suggestedHighlight.tags.map((tag) => ({
            id: tag.id,
          })),
        },
        highlightedRange: {
          create: {
            transcriptId: interviewTranscriptId,
            startWordNumber:
              suggestedHighlight.highlightedRange.startWord.wordNumber,
            startGroupNumber:
              suggestedHighlight.highlightedRange.startWord.groupNumber,
            endWordNumber:
              suggestedHighlight.highlightedRange.endWord.wordNumber,
            endGroupNumber:
              suggestedHighlight.highlightedRange.endWord.groupNumber,
          },
        },
        transcript: {
          create: {
            id: suggestedHighlight.transcript.id,
            isPending: false,
            groups: {
              create: suggestedHighlight.transcript.groups.map((group) => ({
                groupNumber: group.groupNumber,
                speakerId: group.speakerId,
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
      include: this.defaultIncludes,
    });

  updateSuggestedHighlightStatus = async (
    suggestedHighlightId: string,
    status: "approved" | "rejected" | "pending"
  ) =>
    this.prisma.suggestedHighlight.update({
      where: {
        id: suggestedHighlightId,
      },
      data: {
        status,
      },
      include: this.defaultIncludes,
    });
}
