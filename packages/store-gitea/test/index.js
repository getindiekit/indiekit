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
    await indiekit.bootstrap();

    assert.equal(indiekit.publication.store.info.name, "user/repo on Gitea");
  });

  it("Creates file", async () => {
    const result = await gitea.createFile("foo.md", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://gitea.com/username/repo/foo.md");
  });

  it("Creates file at custom instance", async () => {
    const result = await giteaInstance.createFile("foo.md", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://gitea.instance/username/repo/foo.md");
  });

  it("Throws error creating file", async () => {
    await assert.rejects(
      gitea.createFile("401.md", "foo", { message: "Message" }),
      {
        message: "Gitea store: Unauthorized",
      },
    );
  });

  it("Reads file", async () => {
    const result = await gitea.readFile("foo.md");

    assert.equal(result, "foobar");
  });

  it("Throws error reading file", async () => {
    await assert.rejects(gitea.readFile("404.md"), {
      message: "Gitea store: Not found",
    });
  });

  it("Updates file", async () => {
    const result = await gitea.updateFile("foo.md", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://gitea.com/username/repo/foo.md");
  });

  it("Updates and renames file", async () => {
    const result = await gitea.updateFile("foo.md", "foo", {
      message: "Message",
      newPath: "bar.md",
    });

    assert.equal(result, "https://gitea.com/username/repo/bar.md");
  });

  it("Throws error updating file", async () => {
    await assert.rejects(
      gitea.updateFile("401.md", "foo", { message: "Message" }),
      {
        message: "Gitea store: Unauthorized",
      },
    );
  });

  it("Deletes a file", async () => {
    const result = await gitea.deleteFile("foo.md", { message: "Message" });

    assert.equal(result, true);
  });

  it("Throws error deleting a file", async () => {
    await assert.rejects(gitea.deleteFile("401.md", { message: "Message" }), {
      message: "Gitea store: Unauthorized",
    });
  });
});
