import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import {
  PersistenceUserTagPreferences,
  UserTagPreferencesRepository as UserTagPreferencesRepositoryInterface,
} from "../interactors/PreferenceCustomizationInteractor";

@injectable()
export class UserTagPreferencesRepository
  implements UserTagPreferencesRepositoryInterface
{
  constructor(@inject("PrismaClient") private readonly prisma: PrismaClient) {}

  async getUserTagPreferences(
    userId: string
  ): Promise<PersistenceUserTagPreferences> {
    return this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      include: { tagOrder: true },
    });
  }

  async updatePositions(
    preferences: PersistenceUserTagPreferences
  ): Promise<void> {
    await Promise.all(
      preferences.tagOrder.map(async (tagPreferences) => {
        await this.prisma.userTagOrder.upsert({
          where: {
            userId_tagId: {
              userId: preferences.id,
              tagId: tagPreferences.tagId,
            },
          },
          update: { position: tagPreferences.position },
          create: {
            position: tagPreferences.position,
            tagId: tagPreferences.tagId,
            userId: preferences.id,
          },
        });
      })
    );
  }

  async removeTagPositions(userId: string, tagIds: string[]): Promise<void> {
    await this.prisma.userTagOrder.deleteMany({
      where: {
        userId,
        tagId: {
          in: tagIds,
        },
      },
    });
  }
}
