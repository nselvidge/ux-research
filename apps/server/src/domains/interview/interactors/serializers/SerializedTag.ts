import { Tag, TagColor } from "../../entities/Tag";

export interface PersistenceTag {
  id: string;
  name: string;
  workspaceId: string;
  color: TagColor;
  autoExtract: boolean;
  description: string | null;
  isDefault: boolean;
  emoji: string;
}

export interface GatewayTag {
  id: string;
  name: string;
  workspaceId: string;
  color: TagColor;
  autoExtract: boolean;
  description: string | null;
  isDefault: boolean;
  emoji: string;
}

export const serializeTag = ({
  id,
  name,
  workspaceId,
  color,
  autoExtract,
  description,
  isDefault,
  emoji,
}: Tag): PersistenceTag => ({
  id,
  name,
  workspaceId,
  color,
  autoExtract,
  description,
  isDefault,
  emoji,
});

export const deserializeTag = ({
  id,
  name,
  workspaceId,
  color,
  autoExtract,
  description,
  isDefault,
  emoji,
}: PersistenceTag): Tag => ({
  id,
  name,
  workspaceId,
  color,
  autoExtract,
  description,
  isDefault,
  emoji,
});
