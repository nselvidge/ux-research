import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import { RecorderRepository as InteractorRepository } from "../interactors/RecorderInteractor";
import { PersistenceRecorder } from "../interactors/serializers/SerializedRecorder";

@injectable()
export class RecorderRepository implements InteractorRepository {
  private defaultInclude = {
    target: true,
  };
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}
  createRecorder = async ({
    id,
    type,
    externalId,
    status,
    target: { id: targetId, type: targetType },
  }: PersistenceRecorder) => {
    await this.prisma.recorder.create({
      data: {
        id,
        type,
        externalId,
        status,
        target: {
          create: {
            id: targetId,
            type: targetType,
          },
        },
      },
    });
  };

  maybeGetRecorderByTargetId = async (
    targetId: string
  ): Promise<PersistenceRecorder | null> =>
    this.prisma.recorder.findUnique({
      where: {
        targetId: targetId,
      },
      include: this.defaultInclude,
    });


  updateRecorderProperties = async ({
    id,
    type,
    externalId,
    status,
    error
  }: PersistenceRecorder) => {
    await this.prisma.recorder.update({
      where: {
        id,
      },
      data: {
        type,
        externalId,
        status,
        error,
      },
    });
  }

  maybeGetRecorderByExternalId = async (
    externalId: string
  ): Promise<PersistenceRecorder | null> =>
    this.prisma.recorder.findFirst({
      where: {
        externalId,
      },
      include: this.defaultInclude,
    });
}
