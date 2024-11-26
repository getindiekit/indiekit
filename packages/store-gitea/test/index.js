import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Indiekit } from "@indiekit/indiekit";
import { mockAgent } from "@indiekit-test/mock-agent";

import GiteaStore from "../index.js";

await mockAgent("store-gitea");

describe("store-github", async () => {
  const gitea = new GiteaStore({
    token: "token",
    user: "username",
    repo: "repo",
  });

  const giteaInstance = new GiteaStore({
    instance: "https://gitea.instance",
    token: "token",
    user: "username",
    repo: "repo",
  });

  it("Gets plug-in environment", () => {
    assert.deepEqual(gitea.environment, ["GITEA_TOKEN"]);
  });

  it("Gets plug-in info", () => {
    assert.equal(gitea.name, "Gitea store");
    assert.equal(gitea.info.name, "username/repo on Gitea");
    assert.equal(gitea.info.uid, "https://gitea.com/username/repo");
  });

  it("Gets plug-in installation prompts", () => {
    assert.equal(gitea.prompts[0].message, "Where is Gitea hosted?");
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({
      config: {
        plugins: ["@indiekit/store-gitea"],
        publication: { me: "https://website.example" },
        "@indiekit/store-gitea": { user: "user", repo: "repo" },
      },
    });
    await indiekit.installPlugins();
    await indiekit.updatePublicationConfig();

    assert.equal(indiekit.publication.store.info.name, "user/repo on Gitea");
  });

  it("Checks if file exists", async () => {
    assert.equal(await gitea.fileExists("foo.txt"), true);
    assert.equal(await gitea.fileExists("404.txt"), false);
  });

  it("Creates file", async () => {
    const result = await gitea.createFile("new.txt", "new", {
      message: "Message",
    });

    assert.equal(result, "https://gitea.com/username/repo/new.txt");
  });

  it("Doesn’t create file if already exists", async () => {
    const result = await gitea.createFile("foo.txt", "foo", {
      message: "Message",
    });

    assert.equal(result, undefined);
  });

  it("Creates file at custom instance", async () => {
    const result = await giteaInstance.createFile("new.txt", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://gitea.instance/username/repo/new.txt");
  });

  it("Throws error creating file", async () => {
    await assert.rejects(
      gitea.createFile("401.txt", "foo", { message: "Message" }),
      {
        message: "Gitea store: Unauthorized",
      },
    );
  });

  it("Reads file", async () => {
    const result = await gitea.readFile("foo.txt");

    assert.equal(result, "foo");
  });

  it("Throws error reading file", async () => {
    await assert.rejects(gitea.readFile("404.txt"), {
      message: "Gitea store: Not found",
    });
  });

  it("Updates file", async () => {
    const result = await gitea.updateFile("foo.txt", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://gitea.com/username/repo/foo.txt");
  });

  it("Updates and renames file", async () => {
    const result = await gitea.updateFile("foo.txt", "foo", {
      message: "Message",
      newPath: "bar.txt",
    });

    assert.equal(result, "https://gitea.com/username/repo/bar.txt");
  });

  it("Throws error updating file", async () => {
    await assert.rejects(
      gitea.updateFile("401.txt", "foo", { message: "Message" }),
      {
        message: "Gitea store: Unauthorized",
      },
    );
  });

  it("Deletes a file", async () => {
    const result = await gitea.deleteFile("foo.txt", { message: "Message" });

    assert.equal(result, true);
  });

  it("Throws error deleting a file", async () => {
    await assert.rejects(gitea.deleteFile("401.txt", { message: "Message" }), {
      message: "Gitea store: Unauthorized",
    });
  });
});
