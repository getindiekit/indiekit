import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";

import GitlabStorePlugin from "../index.js";

await mockAgent("store-gitlab");

describe("store-gitlab", async () => {
  const gitlab = new GitlabStorePlugin({
    token: "token",
    user: "username",
    repo: "repo",
  });

  const gitlabInstance = new GitlabStorePlugin({
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

  it("Checks if file exists", async () => {
    assert.equal(await gitlab.fileExists("foo.txt"), true);
    assert.equal(await gitlab.fileExists("404.txt"), false);
  });

  it("Creates file", async () => {
    const result = await gitlab.createFile("new.txt", "new", {
      message: "Message",
    });

    assert.equal(result, "https://gitlab.com/username/repo/new.txt");
  });

  it("Doesn’t create file if already exists", async () => {
    const result = await gitlab.createFile("foo.txt", "foo", {
      message: "Message",
    });

    assert.equal(result, undefined);
  });

  it("Creates file with projectId at custom instance", async () => {
    const result = await gitlabInstance.createFile("new.txt", "new", {
      message: "Message",
    });

    assert.equal(result, "https://gitlab.instance/projects/1234/new.txt");
  });

  it("Throws error creating file", async () => {
    await assert.rejects(
      gitlab.createFile("401.txt", "foo", { message: "Message" }),
      {
        message: "GitLab store: Unauthorized",
      },
    );
  });

  it("Reads file", async () => {
    const result = await gitlab.readFile("foo.txt");

    assert.equal(result, "foo");
  });

  it("Throws error reading file", async () => {
    await assert.rejects(gitlab.readFile("401.txt"), {
      message: "GitLab store: Unauthorized",
    });
  });

  it("Updates file", async () => {
    const result = await gitlab.updateFile("foo.txt", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://gitlab.com/username/repo/foo.txt");
  });

  it("Updates and renames file", async () => {
    const result = await gitlab.updateFile("foo.txt", "foo", {
      message: "Message",
      newPath: "bar.txt",
    });

    assert.equal(result, "https://gitlab.com/username/repo/bar.txt");
  });

  it("Throws error updating file", async () => {
    await assert.rejects(
      gitlab.updateFile("401.txt", "foo", { message: "Message" }),
      {
        message: "GitLab store: Unauthorized",
      },
    );
  });

  it("Deletes a file", async () => {
    const result = await gitlab.deleteFile("foo.txt", { message: "Message" });

    assert.equal(result, true);
  });

  it("Throws error deleting a file", async () => {
    await assert.rejects(gitlab.deleteFile("401.txt", { message: "Message" }), {
      message: "GitLab store: Unauthorized",
    });
  });
});
