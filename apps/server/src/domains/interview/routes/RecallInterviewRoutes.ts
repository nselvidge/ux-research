import { RecorderInteractor } from "@root/domains/video/interactors/RecorderInteractor";
import { Logger } from "@root/global/logger";
import { FastifyInstance, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { CoordinatorInteractor } from "../interactors/CoordinatorInteractor";
import { InterviewerInteractor } from "../interactors/InterviewerInteractor";

@injectable()
export class RecallInterviewRoutes {
  constructor(
    @inject("Logger") private logger: Logger,
    private coordinator: CoordinatorInteractor,
    private recorder: RecorderInteractor,
  ) {}

  plugin = async (app: FastifyInstance) => {
    app.post("/recall-events", async (
        request: FastifyRequest<{
          Body: {
            data: {
              bot_id: string;
              event: string;
              status: {
                code:
                  | "ready"
                  | "joining_call"
                  | "in_waiting_room"
                  | "in_call_not_recording"
                  | "in_call_recording"
                  | "call_ended"
                  | "done"
                  | "fatal"
                  | "analysis_done";
                created_at: string;
                message: string | null;
                sub_code: string | null;
              };
            };
          };
        }>
      ) => {
        this.logger.info("Received recall event", {
          body: request.body,
        });
        const code = request.body.data?.status?.code;
        if (!code) {
            this.logger.error("Received recall event with no status code", {
                body: request.body,
            });
            return;
        }
    
        if (["ready", "joining_call", "in_waiting_room"].includes(code)) {
            await this.recorder.updateRecorderStatus({
                externalId: request.body.data.bot_id,
                status: "pending",
            });
        } else if ([ "in_call_not_recording", "in_call_recording" ].includes(code)) {
            await this.recorder.updateRecorderStatus({
                externalId: request.body.data.bot_id,
                status: "recording",
            });
        } else if ([ "call_ended", "fatal", "analysis_done", "done"].includes(code)) {
            await this.recorder.updateRecorderStatus({
                externalId: request.body.data.bot_id,
                status: "done",
            });
        }
        
        if (code === "done") {
          await this.coordinator.handleInterviewReady(
            request.body.data.bot_id,
            "recall"
          );
        }
    
        return;
      });

    return;
  };

}
