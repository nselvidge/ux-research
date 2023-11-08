import { AdminInteractor } from "@root/domains/auth/interactors/Admin";
import { EditorInteractor } from "@root/domains/video/interactors/EditorInteractor";
import { container } from "tsyringe";
import { PreferenceCustomizationInteractor } from "../PreferenceCustomizationInteractor";
import { ResearcherInteractor } from "../ResearcherInteractor";
import { createInterview } from "./utils/createInterview";
import { createTranscript } from "./utils/createTranscript";

jest.mock("@root/domains/auth/interactors/Admin");

const mockGetInterview = jest.fn();

const mockRepositories = {
  interviews: {
    getInterviewById: mockGetInterview,
    addHighlight: jest.fn(),
    addVideoToHighlight: jest.fn(),
  },
};
const mockCreateClip = jest.fn();

const mockEditorInteractor = {
  createClip: mockCreateClip,
};

const mockAdminInteractor = new (AdminInteractor as any)();

describe("ResearcherInteractor", () => {
  beforeAll(() => {
    container.register("Repositories", {
      useValue: mockRepositories,
    });
    container.register(EditorInteractor, {
      useValue: mockEditorInteractor as any,
    });
    container.register(AdminInteractor, {
      useValue: mockAdminInteractor,
    });
    container.register("Logger", {
      useValue: { info: jest.fn(), error: jest.fn() },
    });
    container.register(PreferenceCustomizationInteractor, {
      useValue: jest.fn() as any,
    })
  });
  afterAll(() => {
    container.reset();
  });
  describe("#addHighlightToTranscript", () => {
    it("should successfully add a valid highlight", async () => {
      const transcript = createTranscript({ wordsPerGroup: 2 });
      const interview = createInterview({ transcript });
      mockGetInterview.mockResolvedValueOnce(interview);
      mockCreateClip.mockResolvedValueOnce({ id: "0" });

      const researcher = container.resolve(ResearcherInteractor);

      const result = await researcher.highlightTranscript(
        "0",
        { groupNumber: 0, wordNumber: 0 },
        { groupNumber: 0, wordNumber: 1 }
      );

      expect(result.id).not.toBeNull();
    });
  });
});
