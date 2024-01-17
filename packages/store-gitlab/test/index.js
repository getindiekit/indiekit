import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { Indiekit } from "@indiekit/indiekit";
import { mockAgent } from "@indiekit-test/mock-agent";
import GitlabStore from "../index.js";

await mockAgent("store-gitlab");

describe("store-gitlab", async () => {
  const gitlab = new GitlabStore({
    token: "token",
    user: "username",
    repo: "repo",
  });

  const gitlabInstance = new GitlabStore({
    token: "token",
    projectId: "1234",
    instance: "https://gitlab.instance",
  });

  it("Gets plug-in environment", () => {
    assert.deepEqual(gitlab.environment, ["GITLAB_TOKEN"]);
  });

  it("Gets plug-in info", () => {
    assert.equal(gitlab.name, "GitLab store");
    assert.equal(gitlab.info.name, "username/repo on GitLab");
    assert.equal(gitlab.info.uid, "https://gitlab.com/username/repo");
  });

  it("Gets plug-in installation prompts", () => {
    assert.equal(gitlab.prompts[0].message, "Where is GitLab hosted?");
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({ config: {} });
    gitlab.init(indiekit);

    assert.equal(
      indiekit.publication.store.info.name,
      "username/repo on GitLab",
    );
  });

  it("Creates file", { timeout: 60 }, async () => {
    const result = await gitlab.createFile("foo.md", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://gitlab.com/username/repo/foo.md");
  });

  it("Creates file with projectId at custom instance", async () => {
    const result = await gitlabInstance.createFile("foo.md", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://gitlab.instance/projects/1234/foo.md");
  });

  it("Throws error creating file", async () => {
    await assert.rejects(
      gitlab.createFile("401.md", "foo", { message: "Message" }),
      {
        message: "GitLab store: Unauthorized",
      },
    );
  });

  it("Reads file", async () => {
    const result = await gitlab.readFile("foo.md");

    assert.equal(result, "foobar");
  });

  it("Throws error reading file", async () => {
    await assert.rejects(gitlab.readFile("401.md"), {
      message: "GitLab store: Unauthorized",
    });
  });

  it("Updates file", async () => {
    const result = await gitlab.updateFile("foo.md", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://gitlab.com/username/repo/foo.md");
  });

  it("Updates and renames file", async () => {
    const result = await gitlab.updateFile("foo.md", "foo", {
      message: "Message",
      newPath: "bar.md",
    });

    assert.equal(result, "https://gitlab.com/username/repo/bar.md");
  });

  it("Throws error updating file", async () => {
    await assert.rejects(
      gitlab.updateFile("401.md", "foo", { message: "Message" }),
      {
        message: "GitLab store: Unauthorized",
      },
    );
  });

  it("Deletes a file", async () => {
    const result = await gitlab.deleteFile("foo.md", { message: "Message" });

    assert.equal(result, true);
  });

  it("Throws error deleting a file", async () => {
    await assert.rejects(gitlab.deleteFile("401.md", { message: "Message" }), {
      message: "GitLab store: Unauthorized",
    });
  });
});
