import { Tag } from "./Tag";

export interface UserTagOrder {
  tagId: string;
  position: number;
}

export interface UserTagPreferences {
  id: string;
  tagOrder: UserTagOrder[];
}

export interface UpdateUserTagOrderEvent {
  updatedUserTagPreferences: UserTagPreferences;
  removedTags: string[];
}

export const updateUserTagOrder = (
  preferences: UserTagPreferences,
  tagOrder: string[]
): UpdateUserTagOrderEvent => {
  const newTagOrder = tagOrder.map((tagId, position) => {
    const existingTagOrder = preferences.tagOrder.find(
      (tag) => tag.tagId === tagId
    );

    if (existingTagOrder) {
      return {
        ...existingTagOrder,
        position,
      };
    }

    return {
      tagId,
      position,
    };
  });

  const removedTags = preferences.tagOrder
    .filter((tag) => !tagOrder.includes(tag.tagId))
    .map((tag) => tag.tagId);

  return {
    updatedUserTagPreferences: {
      ...preferences,
      tagOrder: newTagOrder,
    },
    removedTags: removedTags,
  };
};

export const orderTagsBasedOnPreferences = (
  preferences: UserTagPreferences,
  tags: Tag[]
): Tag[] => {
  const orderedTags = preferences.tagOrder
    .sort((a, b) => a.position - b.position)
    .map((tag) => tags.find((t) => t.id === tag.tagId))
    .filter((tag): tag is Tag => tag !== undefined);

  const unorderedTags = tags.filter((tag) => !orderedTags.includes(tag));

  return [...orderedTags, ...unorderedTags];
};
