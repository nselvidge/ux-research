import { ConsumerInteractor } from "@root/domains/interview/interactors/ConsumerInteractor";
import { injectable } from "tsyringe";
import { WorkspaceStatsService } from "../interactors/Admin";

@injectable()
export class WorkspaceStatisticsService implements WorkspaceStatsService {
  constructor(private consumer: ConsumerInteractor) {}
  getWorkspaceStats: (
    workspaceId: string
  ) => Promise<{ interviewCount: number; highlightCount: number }> = async (
    workspaceId
  ) => {
    return this.consumer.getWorkspaceStats(workspaceId);
  };
}
