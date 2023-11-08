import _ from "lodash";
import { injectable } from "tsyringe";
import { Resolvers as ResolverType } from "./generated/graphql";
import { InterviewResolver } from "@root/domains/interview/resolvers/InterviewResolver";
import { TranscriptResolvers } from "@root/domains/interview/resolvers/TranscriptResolver";
import { VideoProviderResolver } from "@root/domains/video/resolvers/VideoProviderResolver";
import { HighlightResolver } from "@root/domains/interview/resolvers/HighlightResolver";
import { UserResolver } from "@root/domains/auth/resolvers/UserResolver";
import { ApolloContext, dateScalar } from "./typedefs";
import { ParticipantResolvers } from "@root/domains/interview/resolvers/ParticipantResolver";
import { TagResolver } from "@root/domains/interview/resolvers/TagResolver";
import { NotificationPreferencesResolver } from "@root/domains/notifications/resolvers/NotificationPreferencesResolver";
import { SummaryResolver } from "@root/domains/interview/resolvers/SummaryResolver";
import { VideoLoader } from "@root/domains/interview/resolvers/dataloaders/VideoLoader";
import { ProjectResolver } from "@root/domains/interview/resolvers/ProjectResolver";

@injectable()
export class Resolvers {
  constructor(
    private interview: InterviewResolver,
    private transcript: TranscriptResolvers,
    private videos: VideoProviderResolver,
    private highlights: HighlightResolver,
    private participants: ParticipantResolvers,
    private users: UserResolver,
    private tags: TagResolver,
    private notifications: NotificationPreferencesResolver,
    private summaries: SummaryResolver,
    private videoLoader: VideoLoader,
    private project: ProjectResolver
  ) {}
  getMergedResolvers(): ResolverType {
    return _.merge(
      { Date: dateScalar },
      this.interview.resolvers,
      this.transcript.resolvers,
      this.videos.resolvers,
      this.highlights.resolvers,
      this.users.resolvers,
      this.participants.resolvers,
      this.tags.resolvers,
      this.notifications.resolvers,
      this.summaries.resolvers,
      this.project.resolvers
    );
  }
  createLoaders(): ApolloContext["loaders"] {
    return {
      video: this.videoLoader.createLoader(),
    };
  }
}
