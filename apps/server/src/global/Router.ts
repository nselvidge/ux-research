import { FastifyInstance } from "fastify";
import { injectable } from "tsyringe";
import { VideoRouter } from "@root/domains/video/routes/VideoRouter";
import { ZoomAuthRouter } from "@root/domains/auth/routers/ZoomAuthRouter";
import { SinglePageAppRouter } from "@root/domains/pages/routers/SinglePageAppRouter";
import { AuthRouter } from "@root/domains/auth/routers/AuthRouter";
import { TranscriptRouter } from "@root/domains/interview/routes/TranscriptRoutes";
import { ZoomInterviewRouter } from "@root/domains/interview/routes/ZoomInterviewRoutes";
import { RecallInterviewRoutes } from "@root/domains/interview/routes/RecallInterviewRoutes";

@injectable()
export class Router {
  constructor(
    private videoRouter: VideoRouter,
    private zoomAuthRouter: ZoomAuthRouter,
    private singlePageAppRouter: SinglePageAppRouter,
    private transcriptRouter: TranscriptRouter,
    private authRouter: AuthRouter,
    private zoomInterviewRouter: ZoomInterviewRouter,
    private recallRouter: RecallInterviewRoutes
  ) {}
  plugin = async (app: FastifyInstance) => {
    app.register(this.authRouter.plugin);
    app.register(this.videoRouter.plugin);
    app.register(this.zoomAuthRouter.plugin);
    app.register(this.transcriptRouter.plugin);
    app.register(this.singlePageAppRouter.plugin);
    app.register(this.zoomInterviewRouter.plugin);
    app.register(this.recallRouter.plugin);
    return;
  };
}
