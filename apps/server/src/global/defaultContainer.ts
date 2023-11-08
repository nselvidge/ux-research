import { Repositories } from "@root/global/Repositories";
import { Resolvers } from "@root/global/Resolvers";
import { container } from "tsyringe";
import { LocalFileService } from "@root/domains/video/services/LocalFileService";
import { AssemblyTranscriptionService } from "@root/domains/interview/services/AssemblyTranscriptionService";
import { S3Service } from "@root/domains/video/services/S3Service";
import { Settings } from "@root/global/Settings";
import { VideoSources } from "@root/domains/video/services/VideoSources";
import { prisma } from "@root/global/prisma";
import { makeLogger } from "@root/global/logger";
import { sentry } from "./sentry";
import { MuxService } from "@root/domains/video/services/MuxService";
import { NotificationServiceFactory } from "@root/domains/notifications/services/NotificationServiceFactory";
import { AuthNotificationService } from "@root/domains/auth/services/AuthNotificationService";
import { InterviewNotificationService } from "@root/domains/interview/services/InterviewNotificationService";
import { MemoryPubSub } from "@root/domains/auth/services/MemoryPubSub";
import { VideoPubSub } from "@root/domains/video/services/VideoPubSub";
import { AnalysisService } from "@root/domains/interview/services/AnalysisService";
import { InterviewPubSub } from "@root/domains/interview/services/InterviewPubSub";
import { VideoPlaybackServices } from "@root/domains/video/services/VideoPlaybackServices";
import { WorkspaceStatisticsService } from "@root/domains/auth/services/WorkspaceStatisticsService";
import { RecordableProviderFactory } from "@root/domains/video/services/RecordableProviderFactory";
import { RecallService } from "@root/domains/video/services/RecallService";
import { ZoomService } from "@root/domains/video/services/ZoomService";
import { ZoomAuth } from "@root/domains/auth/services/ZoomAuth";

export const createContainer = () => {
  const settings = new Settings((process.env.NODE_ENV as any) || "development");

  container.register(Settings, {
    useValue: settings,
  });

  const logger = makeLogger(
    settings.getSetting("prettyLogs"),
    settings.getSetting("logLevel")
  );

  container.register("Logger", {
    useValue: logger,
  });

  container.register("RecorderProvider", {
    useClass: RecallService,
  });

  container.register("Sentry", { useValue: sentry });

  container.register("PrismaClient", { useValue: prisma });

  container.register("Repositories", { useClass: Repositories });

  container.register("Resolvers", { useClass: Resolvers });

  container.register("VideoSourceService", { useClass: LocalFileService });

  container.register("VideoStorageService", { useClass: S3Service });
  container.register("ImageStorageService", { useClass: S3Service });

  container.register("VideoEditingService", { useClass: MuxService });
  container.register("VideoUploadService", { useClass: MuxService });

  container.register("TranscriptionService", {
    useClass: AssemblyTranscriptionService,
  });

  container.register("SummarizationService", {
    useClass: AnalysisService,
  });

  // Singleton pubsub for the entire app
  container.register("WorkspacePubSub", {
    useValue: container.resolve(MemoryPubSub),
  });

  container.register("VideoPubSub", { useClass: VideoPubSub });

  container.register("VideoPublisher", { useClass: VideoPubSub });
  container.register("InterviewPublisher", { useClass: InterviewPubSub });

  container.register("AuthNotificationService", {
    useClass: AuthNotificationService,
  });

  container.register("InterviewNotificationService", {
    useClass: InterviewNotificationService,
  });

  container.register("NotificationServiceFactory", {
    useClass: NotificationServiceFactory,
  });

  container.register("ZoomAuthV1", {
    useFactory: (innerContainer) => {
      const service = innerContainer.resolve(ZoomAuth);
      service.setAppVersion("");
      return service;
    }
  })

  container.register("ZoomAuthV2", {
    useFactory: (innerContainer) => {
      const service = innerContainer.resolve(ZoomAuth);
      service.setAppVersion("V2");
      return service;
    }
  })

  container.register("ZoomServiceV1", {
    useFactory: (innerContainer) => {
      const service = innerContainer.resolve(ZoomService);
      service.setAppVersion("");
      return service;
    }
  })

  container.register("ZoomServiceV2", {
    useFactory: (innerContainer) => {
      const service = innerContainer.resolve(ZoomService);
      service.setAppVersion("V2");
      return service;
    }
  })

  container.register("VideoSourceFactory", {
    useValue: (label: string) => {
      return container.resolve(VideoSources).get(label);
    },
  });
  
  container.register("VideoPlaybackServiceFactory", {
    useValue: (label: string) => {
      return container.resolve(VideoPlaybackServices).getPlaybackService(label);
    },
  });
  container.register("WorkspaceStatsService", {
    useClass: WorkspaceStatisticsService,
  });

  const factory = container.resolve(RecordableProviderFactory);
  container.register("RecordableProviderFactory", {
    useValue: factory.createRecordableProvider,
  });
};
