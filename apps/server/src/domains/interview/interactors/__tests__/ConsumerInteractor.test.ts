import { MemberInteractor } from "@root/domains/auth/interactors/Member";
import { EditorInteractor } from "@root/domains/video/interactors/EditorInteractor";
import { ViewerInteractor } from "@root/domains/video/interactors/ViewerInteractor";
import { container } from "tsyringe";
import { InterviewNotificationService } from "../../services/InterviewNotificationService";
import { ConsumerInteractor } from "../ConsumerInteractor";

import { createInterview } from "./utils/createInterview";
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

describe("ConsumerInteractor", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetMemberById.mockResolvedValue({
      id: "abc123",
      fullName: "Chris",
      email: "abc123@gmail.com",
      confirmed: true,
    });
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
    container.register("Logger", {
      useValue: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
    });
  });
  afterEach(() => {
    container.reset();
  });
  describe("#getInterview", () => {
    it("should return a pending transcript without error", async () => {
      const transcript = createPendingTranscript();

      const interview = createInterview({ transcript });

      mockGetInterview.mockResolvedValueOnce(interview);
      mockGetTranscriptFromService.mockResolvedValueOnce(transcript);

      const interactor = container.resolve(ConsumerInteractor);
      const result = await interactor.getInterview("0");

      expect(result.id).toBe("0");
    });
    it("should update a transcript when it is ready", async () => {
      const transcript = createPendingTranscript();

      const finishedTranscript = createTranscript({});

      const interview = createInterview({ transcript });

      mockGetInterview.mockResolvedValueOnce(interview);
      mockGetTranscriptFromService.mockResolvedValueOnce(finishedTranscript);
      mockAddGroups.mockResolvedValue(null);

      const interactor = container.resolve(ConsumerInteractor);
      const result = await interactor.getInterview("0");

      expect(result.id).toBe("0");
    });
  });
});
