export type TagColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "indigo"
  | "sky"
  | "purple";

export interface ExtractionPolicy {
  autoExtract: boolean;
  description: string;
}

export interface Tag {
  id: string;
  workspaceId: string;
  name: string;
  color: TagColor;
  autoExtract: boolean;
  description: string | null;
  isDefault: boolean;
  emoji: string;
}

export const defaultTags: {
  name: string;
  color: TagColor;
  emoji: string;
  autoExtract?: boolean;
  description?: string;
}[] = [
  { name: "Insight", color: "sky", emoji: "1f4a1" },
  {
    name: "Pain Point",
    color: "red",
    emoji: "1f622",
    autoExtract: false,
    description:
      "A specific pain that the interviewee is experiencing in their workflow. This may or may not be directly related to the product they are being interviewed about",
  },
  { name: "Feature Request", color: "green", emoji: "1f64f" },
  { name: "Feedback", color: "indigo", emoji: "1f4af" },
];

const isEmojiRegex = /^\p{Emoji_Presentation}$/u;

const testEmojiCodePoint = (emoji: string) => {
  const codePoint = parseInt(emoji, 16); // Convert the hex string to an integer
  const character = String.fromCodePoint(codePoint);
  return isEmojiRegex.test(character);
};

export const createTag = ({
  id,
  workspaceId,
  name,
  color,
  emoji,
}: {
  id: string;
  workspaceId: string;
  name: string;
  color: TagColor;
  emoji: string;
}): Tag => {
  if (!testEmojiCodePoint(emoji)) {
    throw new Error("emoji must be a single emoji character");
  }

  return {
    id,
    workspaceId,
    name,
    color,
    emoji,
    autoExtract: false,
    description: null,
    isDefault: false,
  };
};

export const updateTagName = (tag: Tag, nextName: string) => {
  if (tag.isDefault) {
    throw new Error("cannot update the name of a default tag");
  }

  return {
    ...tag,
    name: nextName,
  };
};

export const updateTagColor = (tag: Tag, nextColor: TagColor) => {
  if (tag.isDefault) {
    throw new Error("cannot update the color of a default tag");
  }

  return {
    ...tag,
    color: nextColor,
  };
};

export const updateTagEmoji = (tag: Tag, nextEmoji: string) => {
  if (!testEmojiCodePoint(nextEmoji)) {
    throw new Error("emoji must be a single emoji character");
  }

  if (tag.isDefault) {
    throw new Error("cannot update the emoji of a default tag");
  }

  return {
    ...tag,
    emoji: nextEmoji,
  };
};

// TODO: remove after we have the database populated with correct tag colors
export const pickRandomTagColor = (): TagColor => {
  const tagColors: TagColor[] = [
    "red",
    "orange",
    "yellow",
    "green",
    "indigo",
    "sky",
    "purple",
  ];
  return tagColors[Math.floor(Math.random() * 7)];
};
