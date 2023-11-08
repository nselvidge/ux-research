import "reflect-metadata";
import "../global/moduleAlias";

import { CreatorInteractor } from "@root/domains/video/interactors/CreatorInteractor";
import { container } from "tsyringe";

import { createContainer } from "@root/global/defaultContainer";
import { VideoPubSub } from "@root/domains/video/services/VideoPubSub";
import { InterviewerInteractor } from "@root/domains/interview/interactors/InterviewerInteractor";
import { InterviewPubSub } from "@root/domains/interview/services/InterviewPubSub";
import { CoordinatorInteractor } from "@root/domains/interview/interactors/CoordinatorInteractor";
import { Logger } from "@root/global/logger";

createContainer();

const logger = container.resolve<Logger>("Logger");

logger.info("Starting video worker");

const videoPubSub = container.resolve(VideoPubSub);
const interviewPubSub = container.resolve(InterviewPubSub);

const interviewer = container.resolve(InterviewerInteractor);
const coordinator = container.resolve(CoordinatorInteractor);
const creator = container.resolve(CreatorInteractor);

videoPubSub.subscribeEditableAssetReady(
  interviewer.handleInterviewVideoEditable
);
videoPubSub.onTransferVideoFromSource(creator.transferVideoFromSource);
videoPubSub.subscribeCheckRecordingStatus(creator.checkRecordingStatus);
videoPubSub.subscribeCheckUploadStatus(creator.checkUploadStatus);

interviewPubSub.subscribeToSummaryReady(coordinator.onSummaryReady);
interviewPubSub.subscribeToCheckInterviews(coordinator.checkStaleInterviews);
interviewPubSub.subscribeToExtractedQuotesReady(
  coordinator.handleQuotesExtracted
);

logger.info("Video worker started");
