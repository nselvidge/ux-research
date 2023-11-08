import React from "react";
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { EditHighlightPrompt } from "../EditHighlightPrompt";
import { render } from "../../../common/test/render";
import { graphql } from "msw";
import {
  AddNewTagMutationResult,
  AddNewTagMutationVariables,
  AddTagsMutationResult,
  GetHighlightQueryResult,
  GetHighlightQueryVariables,
  InterviewWorkspaceQueryResult,
  RemoveTagsMutationResult,
  RemoveTagsMutationVariables,
  useGetHighlightQuery,
} from "../../requests/highlights.generated";
import { server } from "~/domains/common/test/server";
import {
  InterviewHighlightsQueryResult,
  InterviewHighlightsQueryVariables,
} from "~/domains/interview/requests/interviews.generated";
import { Tag } from "~/domains/tags/ui/TagSelect";
import { TagColor } from "~/global/generated/graphql";

jest.mock("emoji-picker-react");

const testInterviewId = "abc123";
const testHighlight: GetHighlightQueryResult["data"]["highlight"] = {
  id: "def456",
  tags: [],
  highlightedRange: {
    text: "test text",
    startWord: {
      id: "ghi789",
      wordNumber: 1,
      groupNumber: 1,
      start: 0,
      end: 1,
    },
    endWord: {
      id: "jkl012",
      wordNumber: 2,
      groupNumber: 1,
      start: 2,
      end: 3,
    },
  },
};

const testTags: Tag[] = [
  {
    id: "mno345",
    name: "test tag 1",
    color: TagColor.Red,
    emoji: "21bc",
  },
  {
    id: "pqr678",
    name: "test tag 2",
    color: TagColor.Indigo,
    emoji: "21bc",
  },
];

const TestComponent = () => {
  const { data } = useGetHighlightQuery({
    variables: {
      id: testHighlight.id,
    },
  });

  if (!data) return null;

  return (
    <EditHighlightPrompt
      interviewId={testInterviewId}
      currentHighlight={data?.highlight}
    />
  );
};

describe("EditHighlightPrompt", () => {
  beforeEach(() => {
    server.resetHandlers();
    server.use(
      graphql.query<InterviewWorkspaceQueryResult["data"]>(
        "interviewWorkspace",
        (req, res, ctx) => {
          return res(
            ctx.data({
              interview: {
                __typename: "Interview",
                id: testInterviewId,
                workspace: {
                  id: "abc123",
                  tags: testTags,
                },
              },
            })
          );
        }
      )
    );
    server.use(
      graphql.query<
        InterviewHighlightsQueryResult["data"],
        InterviewHighlightsQueryVariables
      >("interviewHighlights", (req, res, ctx) => {
        return res(
          ctx.data({
            interview: {
              __typename: "Interview",
              id: "other-id",
              currentUserCanEdit: true,
              highlights: [],
              suggestedHighlights: [],
            },
          })
        );
      })
    );
  });
  it("Should render the prompt", async () => {
    // ARRANGE
    render(
      <EditHighlightPrompt
        interviewId={testInterviewId}
        currentHighlight={testHighlight}
      />
    );
    // ACT
    // ASSERT
    // check that the list of tags has rendered
    for (const tag of testTags) {
      expect(await screen.findByText(tag.name)).toBeInTheDocument();
    }
  });
  it("Should allow a user to add a tag to a highlight", async () => {
    // ARRANGE
    let currentHighlight = { ...testHighlight };

    server.use(
      graphql.mutation<AddTagsMutationResult["data"]>(
        "addTags",
        (req, res, ctx) => {
          if (req.variables.interviewId !== testInterviewId) {
            throw new Error("Invalid interview ID");
          }
          if (req.variables.highlightId !== testHighlight.id) {
            throw new Error("Invalid highlight ID");
          }
          if (req.variables.tagIds.length !== 1) {
            throw new Error("Invalid number of tag IDs");
          }

          if (req.variables.tagIds[0] !== testTags[0].id) {
            throw new Error("Invalid tag ID");
          }

          currentHighlight = {
            ...currentHighlight,
            tags: [testTags[0]],
          };

          return res(
            ctx.data({
              addTagsToHighlight: {
                __typename: "Highlight",
                id: testHighlight.id,
                tags: [testTags[0]],
              },
            })
          );
        }
      )
    );

    server.use(
      graphql.query<
        GetHighlightQueryResult["data"],
        GetHighlightQueryVariables
      >("getHighlight", (req, res, ctx) => {
        if (req.variables.id !== testHighlight.id) {
          throw new Error("Invalid highlight ID");
        }

        return res(
          ctx.data({
            highlight: {
              __typename: "Highlight",
              ...currentHighlight,
            },
          })
        );
      })
    );

    render(<TestComponent />);

    // ACT
    // click the first tag
    const tagButton = await screen.findByText(testTags[0].name);

    fireEvent.click(tagButton);

    // ASSERT
    // Once a tag has been added, the remove button should be visible
    await screen.findByLabelText(`saving changes`);
    await screen.findByLabelText(`Remove ${testTags[0].name}`);
  });

  it("Should allow a user to remove a tag from a highlight", async () => {
    // ARRANGE
    let currentHighlight = {
      ...testHighlight,
      tags: [testTags[0]],
    };

    server.use(
      graphql.mutation<
        RemoveTagsMutationResult["data"],
        RemoveTagsMutationVariables
      >("removeTags", (req, res, ctx) => {
        if (req.variables.interviewId !== testInterviewId) {
          throw new Error("Invalid interview ID");
        }
        if (req.variables.highlightId !== testHighlight.id) {
          throw new Error("Invalid highlight ID");
        }
        if (req.variables.tagIds.length !== 1) {
          throw new Error("Invalid number of tag IDs");
        }

        if (req.variables.tagIds[0] !== testTags[0].id) {
          throw new Error("Invalid tag ID");
        }

        currentHighlight = {
          ...currentHighlight,
          tags: [],
        };

        return res(
          ctx.data({
            removeTagsFromHighlight: {
              __typename: "Highlight",
              id: testHighlight.id,
              tags: [],
            },
          })
        );
      })
    );

    server.use(
      graphql.query<
        GetHighlightQueryResult["data"],
        GetHighlightQueryVariables
      >("getHighlight", (req, res, ctx) => {
        if (req.variables.id !== testHighlight.id) {
          throw new Error("Invalid highlight ID");
        }

        return res(
          ctx.data({
            highlight: {
              __typename: "Highlight",
              ...currentHighlight,
            },
          })
        );
      })
    );

    render(<TestComponent />);

    // ACT
    // click the first tag
    const removeButton = await screen.findByLabelText(
      `Remove ${testTags[0].name}`
    );

    fireEvent.click(removeButton);

    // ASSERT
    await screen.findByLabelText(`saving changes`);
    expect(await screen.findByText(testTags[0].name)).toBeInTheDocument();
    expect(() => screen.getByText(`Remove ${testTags[0].name}`)).toThrow();
    await waitForElementToBeRemoved(() =>
      screen.getByLabelText(`saving changes`)
    );
  });

  it("should allow a user to create a new tag", async () => {
    // ARRANGE
    let currentHighlight = {
      ...testHighlight,
    };
    const newTagId = "newTagId";
    const newTagName = "newTag";

    server.use(
      graphql.mutation<
        AddNewTagMutationResult["data"],
        AddNewTagMutationVariables
      >("addNewTag", (req, res, ctx) => {
        if (req.variables.tagName !== newTagName) {
          throw new Error("Invalid tag name");
        }
        const newTag = {
          id: newTagId,
          name: req.variables.tagName,
          color: TagColor.Red,
          emoji: "21bc",
        };

        currentHighlight = {
          ...currentHighlight,
          tags: [newTag],
        };

        return res(
          ctx.data({
            addNewTagToHighlight: {
              __typename: "Highlight",
              id: testHighlight.id,
              tags: [newTag],
            },
          })
        );
      })
    );

    server.use(
      graphql.query<
        GetHighlightQueryResult["data"],
        GetHighlightQueryVariables
      >("getHighlight", (req, res, ctx) => {
        if (req.variables.id !== testHighlight.id) {
          throw new Error("Invalid highlight ID");
        }

        return res(
          ctx.data({
            highlight: {
              __typename: "Highlight",
              ...currentHighlight,
            },
          })
        );
      })
    );

    render(<TestComponent />);

    // ACT
    // click the first tag
    const tagNameInput = await screen.findByLabelText(`tag name input`);
    fireEvent.change(tagNameInput, { target: { value: newTagName } });

    const createButton = await screen.findByText(`Create "${newTagName}"`);
    fireEvent.click(createButton);

    const doneButton = await screen.findByLabelText("done editing tag");
    fireEvent.click(doneButton);

    // ASSERT
    await screen.findByLabelText(`saving changes`);
    await screen.findByLabelText(`Remove ${newTagName}`);
  });
});
