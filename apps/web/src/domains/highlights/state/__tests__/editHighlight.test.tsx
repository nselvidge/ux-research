import { act, renderHook } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import { useCurrentEditingHighlight } from "../editHighlight";

const firstTestHighlight = {
  id: "def456",
};

const secondTestHighlight = {
  id: "ghi789",
};

jest.mock("~/domains/interview/requests/interviews.generated", () => ({
  useInterviewHighlightsQuery: () => ({
    data: {
      interview: {
        highlights: [firstTestHighlight, secondTestHighlight],
      },
    },
  }),
}));

describe("useCurrentEditingHighlight", () => {
  it("Should initialize without a current highlight", () => {
    // ARRANGE
    const { result } = renderHook(() => useCurrentEditingHighlight(), {
      wrapper: RecoilRoot,
    });

    // ACT
    const { currentHighlightId } = result.current;

    // ASSERT
    expect(currentHighlightId).toBeNull();
  });
  describe("Setting the current highlight", () => {
    it("Should set the current highlight", () => {
      // ARRANGE
      const { result } = renderHook(() => useCurrentEditingHighlight(), {
        wrapper: RecoilRoot,
      });

      // ACT
      const { setCurrentHighlight } = result.current;
      act(() => setCurrentHighlight(firstTestHighlight.id));

      // ASSERT
      const { currentHighlightId } = result.current;
      expect(currentHighlightId).toEqual(firstTestHighlight.id);
    });

    it("Should replace the current highlight if it is already set", () => {
      // ARRANGE
      const { result } = renderHook(() => useCurrentEditingHighlight(), {
        wrapper: RecoilRoot,
      });

      // ACT
      const { setCurrentHighlight } = result.current;
      act(() => setCurrentHighlight(firstTestHighlight.id));
      act(() => setCurrentHighlight(secondTestHighlight.id));

      // ASSERT
      const { currentHighlightId } = result.current;
      expect(currentHighlightId).toEqual(secondTestHighlight.id);
    });

    it("Should increment the selectionId when the current highlight is set", () => {
      // ARRANGE
      const { result } = renderHook(() => useCurrentEditingHighlight(), {
        wrapper: RecoilRoot,
      });

      // ACT
      const { setCurrentHighlight } = result.current;
      act(() => setCurrentHighlight(firstTestHighlight.id));
      act(() => setCurrentHighlight(secondTestHighlight.id));
      const { selectionId } = result.current;

      // ASSERT
      expect(selectionId).toEqual(2);
    });
  });
  describe("Clearing the current highlight", () => {
    it("Should clear the current highlight", () => {
      // ARRANGE
      const { result } = renderHook(() => useCurrentEditingHighlight(), {
        wrapper: RecoilRoot,
      });

      // ACT
      const { setCurrentHighlight, clearEditingHighlight } = result.current;
      act(() => setCurrentHighlight(firstTestHighlight.id));
      act(() => clearEditingHighlight());

      // ASSERT
      const { currentHighlightId } = result.current;
      expect(currentHighlightId).toBeNull();
    });
    it("Should increment the selectionId when the current highlight is cleared", () => {
      // ARRANGE
      const { result } = renderHook(() => useCurrentEditingHighlight(), {
        wrapper: RecoilRoot,
      });

      // ACT
      const { setCurrentHighlight, clearEditingHighlight } = result.current;
      act(() => setCurrentHighlight(firstTestHighlight.id));
      act(() => clearEditingHighlight());
      const { selectionId } = result.current;

      // ASSERT
      expect(selectionId).toEqual(2);
    });
  });
  describe("Unsetting the current highlight", () => {
    it("Should unset the current highlight if the correct stopId is passed", () => {
      // ARRANGE
      const { result } = renderHook(() => useCurrentEditingHighlight(), {
        wrapper: RecoilRoot,
      });

      // ACT
      const { setCurrentHighlight, unsetCurrentHighlight } = result.current;
      act(() => setCurrentHighlight(firstTestHighlight.id));
      const { selectionId } = result.current;
      act(() => unsetCurrentHighlight(selectionId));

      // ASSERT
      const { currentHighlightId } = result.current;
      expect(currentHighlightId).toBeNull();
    });
    it("Should not unset the current highlight if the incorrect stopId is passed", () => {
      // ARRANGE
      const { result } = renderHook(() => useCurrentEditingHighlight(), {
        wrapper: RecoilRoot,
      });

      // ACT
      const { setCurrentHighlight, unsetCurrentHighlight } = result.current;
      act(() => setCurrentHighlight(firstTestHighlight.id));
      act(() => unsetCurrentHighlight(0));

      // ASSERT
      const { currentHighlightId } = result.current;
      expect(currentHighlightId).toEqual(firstTestHighlight.id);
    });
  });
});
