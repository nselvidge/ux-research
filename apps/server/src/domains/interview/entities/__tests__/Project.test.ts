import {
  createProject,
  updateProject,
  addProjectTag,
  removeProjectTag,
  updateProjectTagPositions,
  moveTagToPosition,
} from "../Project";
import { Tag } from "../Tag";

const createTag = ({ id, name }: { id: string; name: string }): Tag => ({
  id,
  name,
  workspaceId: "123",
  isDefault: false,
  color: "green",
  autoExtract: false,
  description: "",
  emoji: "21b5",
});

describe("Project", () => {
  describe("createProject", () => {
    it("should create a new project with the given name, description, and workspace ID", () => {
      const name = "My Project";
      const description = "A project for testing";
      const workspaceId = "123";

      const project = createProject(name, description, workspaceId);

      expect(project).toEqual({
        id: expect.any(String),
        name,
        description,
        createdAt: expect.any(Date),
        projectTags: [],
        workspaceId,
      });
    });
  });

  describe("updateProject", () => {
    it("should update the project name and description", () => {
      const project = createProject(
        "My Project",
        "A project for testing",
        "123"
      );

      const updatedProject = updateProject(project, {
        name: "New Name",
        description: "New description",
      });

      expect(updatedProject).toEqual({
        ...project,
        name: "New Name",
        description: "New description",
      });
    });

    it("should throw an error if the project name is empty", () => {
      const project = createProject(
        "My Project",
        "A project for testing",
        "123"
      );

      expect(() => updateProject(project, { name: "" })).toThrow(
        "Project name cannot be empty"
      );
    });
  });

  describe("addProjectTag", () => {
    it("should add a new favorite tag to the project", () => {
      const project = createProject(
        "My Project",
        "A project for testing",
        "123"
      );
      const tag: Tag = createTag({ id: "1", name: "Tag 1" });

      const { project: updatedProject, projectTag } = addProjectTag(
        project,
        tag,
        0
      );

      expect(updatedProject).toEqual({
        ...project,
        projectTags: [
          {
            tagId: "1",
            tag,
            projectId: project.id,
            position: 0,
          },
        ],
      });

      expect(projectTag).toEqual({
        tagId: "1",
        tag,
        projectId: project.id,
        position: 0,
      });
    });

    it("should add a new favorite tag to the end of the list if no position is provided", () => {
      const project = createProject(
        "My Project",
        "A project for testing",
        "123"
      );
      const tag: Tag = createTag({ id: "1", name: "Tag 1" });

      const { project: updatedProject, projectTag } = addProjectTag(
        project,
        tag
      );

      expect(updatedProject).toEqual({
        ...project,
        projectTags: [
          {
            tagId: "1",
            tag,
            projectId: project.id,
            position: 0,
          },
        ],
      });

      expect(projectTag).toEqual({
        tagId: "1",
        tag,
        projectId: project.id,
        position: 0,
      });
    });
  });

  describe("removeProjectTag", () => {
    it("should remove a favorite tag from the project", () => {
      const project = createProject(
        "My Project",
        "A project for testing",
        "123"
      );
      const tag1: Tag = createTag({ id: "1", name: "Tag 1" });
      const tag2: Tag = createTag({ id: "2", name: "Tag 2" });
      const tag3: Tag = createTag({ id: "3", name: "Tag 3" });

      const { project: updatedProject1 } = addProjectTag(project, tag1);
      const { project: updatedProject2 } = addProjectTag(updatedProject1, tag2);
      const { project: updatedProject3 } = addProjectTag(updatedProject2, tag3);

      const { project: removedTagProject, removedTagId } = removeProjectTag(
        updatedProject3,
        "2"
      );

      expect(removedTagProject).toEqual({
        ...updatedProject3,
        projectTags: [
          {
            tagId: "1",
            tag: tag1,
            projectId: project.id,
            position: 0,
          },
          {
            tagId: "3",
            tag: tag3,
            projectId: project.id,
            position: 1,
          },
        ],
      });

      expect(removedTagId).toEqual("2");
    });

    it("should throw an error if the tag ID is not found in the project", () => {
      const project = createProject(
        "My Project",
        "A project for testing",
        "123"
      );

      expect(() => removeProjectTag(project, "1")).toThrow(
        "Tag with ID 1 not found in project"
      );
    });
  });

  describe("updateProjectTagPositions", () => {
    it("should update the positions of the favorite tags in the project", () => {
      const project = createProject(
        "My Project",
        "A project for testing",
        "123"
      );
      const tag1: Tag = createTag({ id: "1", name: "Tag 1" });
      const tag2: Tag = createTag({ id: "2", name: "Tag 2" });
      const tag3: Tag = createTag({ id: "3", name: "Tag 3" });

      const { project: updatedProject1 } = addProjectTag(project, tag1);
      const { project: updatedProject2 } = addProjectTag(updatedProject1, tag2);
      const { project: updatedProject3 } = addProjectTag(updatedProject2, tag3);

      const updatedProject = updateProjectTagPositions(updatedProject3, [
        { tagId: "3", position: 0 },
        { tagId: "1", position: 1 },
        { tagId: "2", position: 2 },
      ]);

      expect(updatedProject).toEqual({
        ...updatedProject3,
        projectTags: [
          {
            tagId: "3",
            tag: tag3,
            projectId: project.id,
            position: 0,
          },
          {
            tagId: "1",
            tag: tag1,
            projectId: project.id,
            position: 1,
          },
          {
            tagId: "2",
            tag: tag2,
            projectId: project.id,
            position: 2,
          },
        ],
      });
    });

    it("should throw an error if a new position is not provided for a tag", () => {
      const project = createProject(
        "My Project",
        "A project for testing",
        "123"
      );
      const tag1: Tag = createTag({ id: "1", name: "Tag 1" });
      const tag2: Tag = createTag({ id: "2", name: "Tag 2" });

      const { project: updatedProject } = addProjectTag(project, tag1);
      const { project: updatedProject2 } = addProjectTag(updatedProject, tag2);

      expect(() =>
        updateProjectTagPositions(updatedProject2, [
          { tagId: "1", position: 0 },
        ])
      ).toThrow("New position not provided for tag with ID 2");
    });

    it("should throw an error if duplicate tag IDs are provided", () => {
      const project = createProject(
        "My Project",
        "A project for testing",
        "123"
      );
      const tag1: Tag = createTag({ id: "1", name: "Tag 1" });
      const tag2: Tag = createTag({ id: "2", name: "Tag 2" });

      const { project: updatedProject } = addProjectTag(project, tag1);
      const { project: updatedProject2 } = addProjectTag(updatedProject, tag2);

      expect(() =>
        updateProjectTagPositions(updatedProject2, [
          { tagId: "1", position: 0 },
          { tagId: "2", position: 1 },
          { tagId: "1", position: 2 },
        ])
      ).toThrow("Duplicate tag IDs provided: 1");
    });

    it("should throw an error if new tag IDs are provided", () => {
      const project = createProject(
        "My Project",
        "A project for testing",
        "123"
      );
      const tag1: Tag = createTag({ id: "1", name: "Tag 1" });

      const { project: updatedProject } = addProjectTag(project, tag1);

      expect(() =>
        updateProjectTagPositions(updatedProject, [
          { tagId: "1", position: 0 },
          { tagId: "2", position: 1 },
        ])
      ).toThrow("Invalid tag IDs provided: 2");
    });
  });

  describe("moveTagToPosition", () => {
    it("should move a favorite tag to a new position in the project", () => {
      const project = createProject(
        "My Project",
        "A project for testing",
        "123"
      );
      const tag1: Tag = createTag({ id: "1", name: "Tag 1" });
      const tag2: Tag = createTag({ id: "2", name: "Tag 2" });
      const tag3: Tag = createTag({ id: "3", name: "Tag 3" });

      const { project: updatedProject1 } = addProjectTag(project, tag1);
      const { project: updatedProject2 } = addProjectTag(updatedProject1, tag2);
      const { project: updatedProject3 } = addProjectTag(updatedProject2, tag3);

      const updatedProject = moveTagToPosition(updatedProject3, "2", 0);

      expect(updatedProject).toEqual({
        ...updatedProject3,
        projectTags: [
          {
            tagId: "2",
            tag: tag2,
            projectId: project.id,
            position: 0,
          },
          {
            tagId: "1",
            tag: tag1,
            projectId: project.id,
            position: 1,
          },
          {
            tagId: "3",
            tag: tag3,
            projectId: project.id,
            position: 2,
          },
        ],
      });
    });

    it("should throw an error if the tag ID is not found in the project", () => {
      const project = createProject(
        "My Project",
        "A project for testing",
        "123"
      );

      expect(() => moveTagToPosition(project, "1", 0)).toThrow(
        "Tag with ID 1 not found in project"
      );
    });
  });
});
