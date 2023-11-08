import { Tag } from "../Tag";
import {
  orderTagsBasedOnPreferences,
  updateUserTagOrder,
  UserTagPreferences,
} from "../UserTagPreferences";

describe("UserTagPreferences", () => {
  describe("updateUserTagOrder", () => {
    const preferences: UserTagPreferences = {
      id: "1",
      tagOrder: [
        { tagId: "1", position: 0 },
        { tagId: "2", position: 1 },
        { tagId: "3", position: 2 },
      ],
    };

    it("Should add a new tag to the end of the list", () => {
      const result = updateUserTagOrder(preferences, ["1", "2", "3", "4"]);

      expect(result.updatedUserTagPreferences.tagOrder[3].tagId).toEqual("4");
    });

    it("Should update the position of a tag that is already in the list", () => {
      const result = updateUserTagOrder(preferences, ["1", "3", "2"]);

      expect(result.updatedUserTagPreferences.tagOrder[0].tagId).toEqual("1");
      expect(result.updatedUserTagPreferences.tagOrder[1].tagId).toEqual("3");
      expect(result.updatedUserTagPreferences.tagOrder[2].tagId).toEqual("2");
    });

    it("Should remove a tag from the list when it is not included in the new order", () => {
      const result = updateUserTagOrder(preferences, ["1", "2"]);

      expect(result.updatedUserTagPreferences.tagOrder.length).toEqual(2);
      expect(result.removedTags).toEqual(["3"]);
    });
  });

  describe("orderTagsBasedOnPreferences", () => {
    const preferences: UserTagPreferences = {
      id: "1",
      tagOrder: [
        { tagId: "2", position: 0 },
        { tagId: "4", position: 2 },
        { tagId: "3", position: 3 },
      ],
    };

    const tags: Tag[] = [
      {
        id: "1",
        workspaceId: "1",
        name: "Tag 1",
        color: "red",
        autoExtract: false,
        description: null,
        isDefault: false,
        emoji: "21b5",
      },
      {
        id: "2",
        workspaceId: "1",
        name: "Tag 2",
        color: "orange",
        autoExtract: false,
        description: null,
        isDefault: false,
        emoji: "21b5",
      },
      {
        id: "3",
        workspaceId: "1",
        name: "Tag 3",
        color: "yellow",
        autoExtract: false,
        description: null,
        isDefault: false,
        emoji: "21b5",
      },
      {
        id: "4",
        workspaceId: "1",
        name: "Tag 4",
        color: "green",
        autoExtract: false,
        description: null,
        isDefault: false,
        emoji: "21b5",
      },
    ];

    it("Should return the full list of unordered tags when there are no ordered tags", () => {
      const preferencesWithNoOrder: UserTagPreferences = {
        id: "1",
        tagOrder: [],
      };

      const result = orderTagsBasedOnPreferences(preferencesWithNoOrder, tags);

      expect(result).toEqual(tags);
    });

    it("Should return all ordered tags in the correct order before unordered tags", () => {
      const result = orderTagsBasedOnPreferences(preferences, tags);

      expect(result[0].id).toEqual("2");
      expect(result[1].id).toEqual("4");
      expect(result[2].id).toEqual("3");
      expect(result[3].id).toEqual("1");
    });
  });
});
