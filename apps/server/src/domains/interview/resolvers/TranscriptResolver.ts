import { injectable } from "tsyringe";
import { Resolvers } from "@root/global/generated/graphql";
import { ConsumerInteractor } from "../interactors/ConsumerInteractor";

@injectable()
export class TranscriptResolvers {
  constructor(private consumer: ConsumerInteractor) {}
  resolvers: Resolvers = {
    TranscriptGroup: {
      id: ({ transcriptId, groupNumber }) => `${transcriptId}-${groupNumber}`,
      speaker: ({ speakerId }) => this.consumer.getParticipant(speakerId),
      words: ({ words }) => {
        if (!words) {
          throw new Error("This query does not support word-level data");
        }
        return words;
      },
    },
    TranscriptWord: {
      id: ({ transcriptId, groupNumber, wordNumber }) =>
        `${transcriptId}-${groupNumber}-${wordNumber}`,
    },
  };
}
