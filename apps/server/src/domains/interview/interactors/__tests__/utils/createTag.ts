import { Tag, TagColor } from "../../../entities/Tag";

export const createTag = ({
  name = "test tag",
  workspaceId = "abc123",
  id = "abc123",
  color = "red",
}: {
  name?: string;
  id?: string;
  workspaceId?: string;
  color?: TagColor;
}): Tag => ({
  name,
  workspaceId,
  id,
  color,
  autoExtract: false,
  description: null,
  isDefault: false,
  emoji: "21b5",
});
