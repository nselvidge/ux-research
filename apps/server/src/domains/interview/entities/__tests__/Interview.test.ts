import { deserializeHighlight } from "../../interactors/serializers/SerializedHighlight";
import { deserializeInterview } from "../../interactors/serializers/SerializedInterview";
import { deserializeTag } from "../../interactors/serializers/SerializedTag";
import {
  createPendingHighlight,
  createInterview,
  createHighlight,
} from "../../interactors/__tests__/utils/createInterview";
import { createTag } from "../../interactors/__tests__/utils/createTag";
import { createTranscript } from "../../interactors/__tests__/utils/createTranscript";
import { unwrap } from "../../utils/Result";
import { addHighlightToInterview, addTagToHighlightOnInterview, isInterview } from "../Interview";

describe("Interview Entity", () => {
  describe("addTagToHighlightOnInterview", () => {
    it("should fail if highlight does not exist", () => {
      const interview = deserializeInterview(createInterview({}));
      const highlight = createPendingHighlight({});
      const tag = deserializeTag(createTag({}));

      if (!isInterview(interview)) {
        throw new Error("error creating interview");
      }

      expect(() => addTagToHighlightOnInterview(interview,  highlight.id, tag)).toThrow(
        "highlight does not exist on interview"
      );
    });
    it("should fail if tag does not belong to workspace", () => {
      const transcript = createTranscript({ groups: 1, wordsPerGroup: 2 });
      const anyInterview = deserializeInterview(
        createInterview({ transcript, workspaceId: "111222" })
      );
      if (!isInterview(anyInterview)) {
        throw new Error("error creating interview");
      }

      const highlight = deserializeHighlight(
        createHighlight({
          transcript: transcript,
        }),
        anyInterview.transcript
      );

      const interview = unwrap(addHighlightToInterview(anyInterview, highlight));

      const tag = deserializeTag(createTag({}));

      expect(() => addTagToHighlightOnInterview(interview, highlight.id, tag)).toThrow(
        "tag does not belong to same workspace as interview"
      );
    });
  });
});
