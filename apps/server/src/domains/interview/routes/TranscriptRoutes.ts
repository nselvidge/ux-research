import { Logger } from "@root/global/logger";
import { FastifyInstance, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { object, string } from "yup";
import { InterviewerInteractor } from "../interactors/InterviewerInteractor";

export interface RouterVideoStorageService {
  getVideoSize(idWithExtension: string): Promise<number>;
}

const webhookValidator = object({
  transcript_id: string(),
  status: string(),
});

interface TranscriptReadyWebhook {
  transcript_id: string;
  status: string;
}

@injectable()
export class TranscriptRouter {
  constructor(
    private interviewer: InterviewerInteractor,
    @inject("Logger") private logger: Logger
  ) {}

  plugin = async (app: FastifyInstance) => {
    app.post("/assembly/transcript-ready", this.handleTranscriptReady);
    return;
  };

  handleTranscriptReady = async (
    request: FastifyRequest<{ Body: TranscriptReadyWebhook }>
  ) => {
    const data = request.body;

    webhookValidator.validateSync(request.body);
    this.logger.info("Received transcript ready webhook", { data });
    if (data.status === "error") {
      this.logger.error("Transcript error", { data });
      return "ok";
    }

    await this.interviewer.handleTranscriptReady(data.transcript_id);

    return "success";
  };
}
