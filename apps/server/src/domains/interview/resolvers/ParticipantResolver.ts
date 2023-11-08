import { injectable } from "tsyringe";
import { Resolvers } from "@root/global/generated/graphql";
import { ResearcherInteractor } from "../interactors/ResearcherInteractor";
import { AdminInteractor } from "@root/domains/auth/interactors/Admin";

@injectable()
export class ParticipantResolvers {
  constructor(
    private researcher: ResearcherInteractor,
    private admin: AdminInteractor
  ) {}
  resolvers: Resolvers = {
    Mutation: {
      updateSpeakerName: async (
        _,
        { speakerId, newName, interviewId },
        { userId }
      ) => {
        await this.researcher.ensureUserIsResearcher(userId, interviewId);

        return this.researcher.updateSpeakerName(
          interviewId,
          speakerId,
          newName
        );
      },
    },
  };
}
