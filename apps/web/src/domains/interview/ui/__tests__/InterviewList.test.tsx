import React from "react";
import { InterviewList } from "../InterviewList";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("~/domains/workspaces/state/currentWorkspace", () => ({
  useCurrentWorkspace: () => ({
    currentWorkspace: "abc123",
  }),
}));

describe("InterviewList", () => {
  it("should render all returned interviews", async () => {
    // ARRANGE
    render(
      <InterviewList
        interviews={[
          {
            id: "abc123",
            name: "Untitled Interview",
            date: 1,
            creator: { fullName: "John Doe" },
            highlights: [],
            pendingHighlights: [],
          },
        ]}
      />
    );

    // ACT
    await screen.findByText("Untitled Interview");

    // ASSERT
    expect(screen.getAllByText("Untitled Interview")).toHaveLength(1);
  });
});
