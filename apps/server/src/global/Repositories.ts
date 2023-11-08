import { injectable } from "tsyringe";
import { InteractorRepositories } from "@root/domains/interview/interactors/InteractorRepositories";
import { InterviewRepository } from "@root/domains/interview/repositories/InterviewRepository";
import { TranscriptRepository } from "@root/domains/interview/repositories/TranscriptRepository";
import { UserRepository } from "@root/domains/auth/repositories/UserRepository";
import { AdminRepositories } from "@root/domains/auth/interactors/Admin";
import { MemberInteractorRepositories } from "@root/domains/auth/interactors/Member";
import { WorkspaceRepository } from "@root/domains/auth/repositories/WorkspaceRepository";
import { ParticipantRepository } from "@root/domains/interview/repositories/ParticipantRepository";
import { TagRepository } from "@root/domains/interview/repositories/TagRepository";
import { VideoRepository } from "@root/domains/video/repositories/VideoRepository";
import { CreatorRepositories } from "@root/domains/video/interactors/CreatorInteractor";
import { ViewerRepositories } from "@root/domains/video/interactors/ViewerInteractor";
import { EditorRepositories } from "@root/domains/video/interactors/EditorInteractor";
import { NotificationRepositories } from "@root/domains/notifications/interactors/Receiver";
import { NotificationPreferencesRepository } from "@root/domains/notifications/repositories/NotificationPreferencesRepository";
import { UserTagPreferencesRepository } from "@root/domains/interview/repositories/UserTagPreferencesRepository";
import { SuggestedHighlightRepository } from "@root/domains/interview/repositories/SuggestedHighlightRepository";
import { ProjectRepository } from "@root/domains/interview/repositories/ProjectRepository";
import { RecorderRepositories } from "@root/domains/video/interactors/RecorderInteractor";
import { RecorderRepository } from "@root/domains/video/repositories/RecorderRepository";

@injectable()
export class Repositories
  implements
    InteractorRepositories,
    AdminRepositories,
    MemberInteractorRepositories,
    CreatorRepositories,
    ViewerRepositories,
    EditorRepositories,
    NotificationRepositories,
    RecorderRepositories
{
  constructor(
    public interviews: InterviewRepository,
    public transcripts: TranscriptRepository,
    public users: UserRepository,
    public workspaces: WorkspaceRepository,
    public participants: ParticipantRepository,
    public tags: TagRepository,
    public videos: VideoRepository,
    public notificationPreferences: NotificationPreferencesRepository,
    public userTagPreferences: UserTagPreferencesRepository,
    public suggestedHighlights: SuggestedHighlightRepository,
    public projects: ProjectRepository,
    public recorders: RecorderRepository
  ) {}
}
