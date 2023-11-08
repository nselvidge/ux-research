import { Transcript } from "../Transcript";

export const createTranscriptFromText = (text: string) => {
  const groups = text.split("\n").map((group, i) => ({
    groupNumber: i,
    speakerId: group.split(":")[0],
    start: i * 100,
    end: (i + 1) * 100 - 1,
    text: group.split(":")[1],
    words: group
      .split(":")[1]
      .split(" ")
      .map((word, j) => ({
        groupNumber: i,
        wordNumber: j,
        start: i * 100 + j * 2,
        end: i * 100 + (j + 1) * 2,
        text: word,
      })),
  }));

  return Transcript.create({
    id: "1",
    groups,
  });
};
