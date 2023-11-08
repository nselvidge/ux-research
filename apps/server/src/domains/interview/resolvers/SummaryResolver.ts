import { Resolvers } from "@root/global/generated/graphql";
import { injectable } from "tsyringe";
import { ReportInteractor } from "../interactors/ReportInteractor";

@injectable()
export class SummaryResolver {
  constructor(private reportInteractor: ReportInteractor) {}
  resolvers: Resolvers = {
    Mutation: {
      updateInterviewSummary: async (_, { interviewId, text }, { userId }) => {
        await this.reportInteractor.ensureUserIsReporter(userId, interviewId);

        return this.reportInteractor.updateSummary({ interviewId, text });
      },
    },
  };
}
