import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import { InteractorParticipantRepository } from "../interactors/InteractorRepositories";
import { SerializedParticipant } from "../interactors/serializers/SerializedParticipant";

@injectable()
export class ParticipantRepository implements InteractorParticipantRepository {
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

  addParticipants: (
    participants: SerializedParticipant[]
  ) => Promise<SerializedParticipant[]> = (participants) =>
    this.prisma.participant
      .createMany({
        data: participants.map(({ id, name }) => ({ id, name })),
      })
      .then(() => participants);

  getById = async (id: string) =>
    this.prisma.participant.findUniqueOrThrow({ where: { id } });

  updateName = async (id: string, name: string) =>
    this.prisma.participant.update({ where: { id }, data: { name } });
}
