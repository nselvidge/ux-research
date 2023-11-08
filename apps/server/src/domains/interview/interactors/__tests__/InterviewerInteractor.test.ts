import { AdminInteractor } from "@root/domains/auth/interactors/Admin";
import { MemberInteractor } from "@root/domains/auth/interactors/Member";
import { EditorInteractor } from "@root/domains/video/interactors/EditorInteractor";
import { ViewerInteractor } from "@root/domains/video/interactors/ViewerInteractor";
import { Tracker } from "@root/global/tracker";
import { container } from "tsyringe";
import { InterviewNotificationService } from "../../services/InterviewNotificationService";
import { InterviewerInteractor } from "../InterviewerInteractor";
import {
  createPendingHighlight,
  createInterview,
  createRecording,
} from "./utils/createInterview";
import {
  createPendingTranscript,
  createTranscript,
} from "./utils/createTranscript";

jest.mock("../../services/InterviewNotificationService");
jest.mock("@root/domains/auth/interactors/Member");

const mockAddGroups = jest.fn();

const mockGetTranscriptFromService = jest.fn();

const mockGetInterview = jest.fn();
const mockGetInterviewByTranscriptId = jest.fn();

const mockAddParticipants = jest
  .fn()
  .mockResolvedValue({ id: "abc123", name: "Chris" });

const mockGetTagsForWorkspace = jest.fn();

const mockRepositories = {
  interviews: {
    getInterviewById: mockGetInterview,
    addHighlightTranscript: jest.fn().mockResolvedValue(null),
    getInterviewByTranscriptId: mockGetInterviewByTranscriptId,
    addVideoToHighlight: jest.fn(),
  },
  transcripts: {
    addGroups: mockAddGroups,
  },
  participants: {
    addParticipants: mockAddParticipants,
  },
  tags: {
    getTagsForWorkspace: mockGetTagsForWorkspace,
  },
};

const mockTranscriptionService = {
  getTranscriptById: mockGetTranscriptFromService,
};

const mockGetVideo = jest.fn();
const mockGetPreviewImageUrlForVideo = jest.fn();

const mockViewerInteractor = {
  getVideoById: mockGetVideo,
  getPreviewImageUrlForVideo: mockGetPreviewImageUrlForVideo,
};

const mockCreateClip = jest.fn();

const mockEditorInteractor = {
  createClip: mockCreateClip,
};

const mockGetMemberById = jest.fn();

const mockMemberInteractor = {
  getMemberById: mockGetMemberById,
};

const mockNotifier = new (InterviewNotificationService as any)();

const mockInterviewPublisher = {
  publishGenerateSummary: jest.fn(),
  publishExtractQuotes: jest.fn(),
};

describe("ConsumerInteractor", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetMemberById.mockResolvedValue({
      id: "abc123",
      fullName: "Chris",
      email: "abc123@gmail.com",
      confirmed: true,
    });
    mockGetTagsForWorkspace.mockResolvedValue([]);
    container.register("Repositories", {
      useValue: mockRepositories,
    });
    container.register("TranscriptionService", {
      useValue: mockTranscriptionService,
    });
    container.register("Logger", {
      useValue: { info: jest.fn(), error: jest.fn() },
    });
    container.register(ViewerInteractor, {
      useValue: mockViewerInteractor as any,
    });
    container.register(EditorInteractor, {
      useValue: mockEditorInteractor as any,
    });
    container.register("InterviewNotificationService", {
      useValue: mockNotifier,
    });
    container.register(MemberInteractor, {
      useValue: mockMemberInteractor as any,
    });
    container.register("VideoStorageService", {
      useValue: {},
    });
    container.register("VideoPublisher", {
      useValue: { publishTransferVideoFromSource: jest.fn() },
    });
    container.register(AdminInteractor as any, { useValue: {} });
    container.register("VideoSourceFactory" as any, { useValue: jest.fn() });
    container.register("InterviewPublisher", {
      useValue: mockInterviewPublisher,
    });
    container.register(Tracker, {
      useValue: { trackEvent: jest.fn() } as any,
    });
  });
  afterEach(() => {
    container.reset();
  });
  describe("handleTranscriptReady", () => {
    it("should correctly create highlights from timestamp highlights when transcript is ready", async () => {
      const transcript = createPendingTranscript();

      // total length = 5 * 50 * 200 = 50000
      const finishedTranscript = createTranscript({
        groups: 5,
        wordsPerGroup: 50,
      });

      const highlight = createPendingHighlight({ timestamp: 30000 });
      const recording = createRecording({});

      const interview = createInterview({
        transcript,
        highlights: [highlight],
      });

      mockGetInterviewByTranscriptId.mockResolvedValueOnce(interview);
      mockGetTranscriptFromService.mockResolvedValueOnce(finishedTranscript);
      mockAddGroups.mockResolvedValue(null);
      mockGetVideo.mockResolvedValue(recording);
      mockCreateClip.mockResolvedValueOnce({ id: "0" });

      const interactor = container.resolve(InterviewerInteractor);
      const result = await interactor.handleTranscriptReady(
        finishedTranscript.id
      );

      expect(result?.id).toBe("0");
      expect(result?.highlights).toHaveLength(1);
      expect(result?.highlights[0].highlightedRange?.startWord.start).toBe(
        10000
      );
      expect(result?.highlights[0].highlightedRange?.endWord.start).toBe(49800);
    });
  });
});
