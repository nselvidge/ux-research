import { Logger } from "@root/global/logger";
import { inject, injectable } from "tsyringe";
import {
  orderTagsBasedOnPreferences,
  updateUserTagOrder,
} from "../entities/UserTagPreferences";
import { GatewayTag } from "./serializers/SerializedTag";

export interface GatewayUserTagPreferences {
  id: string;
  tagOrder: {
    tagId: string;
    position: number;
  }[];
}

export interface PersistenceUserTagPreferences {
  id: string;
  tagOrder: {
    tagId: string;
    position: number;
  }[];
}

export interface UserTagPreferencesRepository {
  getUserTagPreferences(userId: string): Promise<PersistenceUserTagPreferences>;
  updatePositions(preferences: PersistenceUserTagPreferences): Promise<void>;
  removeTagPositions(userId: string, tagIds: string[]): Promise<void>;
}

export interface PreferenceCustomizerTagRepository {
  getTagsForWorkspace(workspaceId: string): Promise<GatewayTag[]>;
}

export interface Repositories {
  userTagPreferences: UserTagPreferencesRepository;
  tags: PreferenceCustomizerTagRepository;
}

@injectable()
export class PreferenceCustomizationInteractor {
  constructor(
    @inject("Repositories") private readonly repositories: Repositories,
    @inject("Logger") private readonly logger: Logger
  ) {}

  async updateUserTagOrder(
    userId: string,
    workspaceId: string,
    tagOrder: string[]
  ): Promise<GatewayTag[]> {
    const preferences =
      await this.repositories.userTagPreferences.getUserTagPreferences(userId);

    const workspaceTags = await this.repositories.tags.getTagsForWorkspace(
      workspaceId
    );

    // ensure all tag Ids in tagOrder exist in the workspace
    const tagIds = workspaceTags.map((tag) => tag.id);
    const invalidTagIds = tagOrder.filter((tagId) => !tagIds.includes(tagId));
    if (invalidTagIds.length > 0) {
      this.logger.error(
        "Invalid tag IDs provided to updateUserTagOrder: " +
          invalidTagIds.join(", "),
        {
          userId,
          workspaceId,
          tagOrder,
        }
      );

      throw new Error(`Invalid tag IDs provided. cannot update tagOrder`);
    }

    const { updatedUserTagPreferences, removedTags } = updateUserTagOrder(
      preferences,
      tagOrder
    );

    await this.repositories.userTagPreferences.updatePositions(
      updatedUserTagPreferences
    );

    await this.repositories.userTagPreferences.removeTagPositions(
      userId,
      removedTags
    );

    return orderTagsBasedOnPreferences(
      updatedUserTagPreferences,
      workspaceTags
    );
  }

  async getTagPreferences(userId: string): Promise<GatewayUserTagPreferences> {
    return this.repositories.userTagPreferences.getUserTagPreferences(userId);
  }
}
