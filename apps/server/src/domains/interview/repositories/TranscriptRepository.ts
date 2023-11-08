import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import { InteractorTranscriptRepository } from "../interactors/InteractorRepositories";
import { MinimalSerializedTranscript } from "../interactors/serializers/SerializedTranscript";

@injectable()
export class TranscriptRepository implements InteractorTranscriptRepository {
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}
  defaultInclude = {
    groups: {
      include: { words: { orderBy: { wordNumber: "asc" } } },
      orderBy: { groupNumber: "asc" },
    },
  };

  createTranscriptForInterview = async (
    interviewId: string,
    transcript: MinimalSerializedTranscript
  ): Promise<MinimalSerializedTranscript> => {
    return this.prisma.transcript.create({
      data: {
        id: transcript.id,
        interviewId,
        isPending: transcript.isPending,
        groups: {
          createMany: {
            data: transcript.groups.map((group) => ({
              ...group,
              words: { createMany: { data: group.words } },
            })),
          },
        },
      },
      include: {
        groups: {
          include: { words: { orderBy: { wordNumber: "asc" } } },
          orderBy: { groupNumber: "asc" },
        },
      },
    });
  };

  addGroups = async (
    transcript: MinimalSerializedTranscript
  ): Promise<MinimalSerializedTranscript> =>
    this.prisma.transcript.update({
      where: { id: transcript.id },
      data: {
        isPending: false,
        groups: {
          create: transcript.groups.map(
            ({ words, speakerId, groupNumber, text }) => ({
              speakerId,
              groupNumber,
              text,
              words: {
                create: words.map(({ start, end, wordNumber, text }) => ({
                  start,
                  end,
                  wordNumber,
                  text,
                })),
              },
            })
          ),
        },
      },
      include: {
        groups: {
          include: { words: { orderBy: { wordNumber: "asc" } } },
          orderBy: { groupNumber: "asc" },
        },
      },
    });
}
