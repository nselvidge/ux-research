import "reflect-metadata";
import "../global/moduleAlias";
import { container } from "tsyringe";

import { createContainer } from "@root/global/defaultContainer";
import { VideoPubSub } from "@root/domains/video/services/VideoPubSub";
import { InterviewerInteractor } from "@root/domains/interview/interactors/InterviewerInteractor";
import { InterviewPubSub } from "@root/domains/interview/services/InterviewPubSub";
import { CoordinatorInteractor } from "@root/domains/interview/interactors/CoordinatorInteractor";
import { Logger } from "@root/global/logger";
import { AMQPPubSub } from "@root/domains/messages/services/AMQPPubSub";

createContainer();

const interviewCheckFrequency = process.env.INTERVIEW_CHECK_FREQUENCY || "5";

const logger = container.resolve<Logger>("Logger");

logger.info("Starting heartbeat worker");

const interviewPubSub = container.resolve(InterviewPubSub);

interviewPubSub.scheduleHeartbeat(parseInt(interviewCheckFrequency, 10));

logger.info("Heartbeat worker started");
