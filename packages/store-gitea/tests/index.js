import test from "ava";
import { Indiekit } from "@indiekit/indiekit";
import { mockAgent } from "@indiekit-test/mock-agent";
import GiteaStore from "../index.js";

await mockAgent("store-gitea");

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

test("Gets plug-in info", (t) => {
  t.is(gitea.name, "Gitea store");
  t.is(gitea.info.name, "username/repo on Gitea");
  t.is(gitea.info.uid, "https://gitea.com/username/repo");
});

test("Gets plug-in installation prompts", (t) => {
  t.is(gitea.prompts[0].message, "Where is Gitea hosted?");
});

test("Initiates plug-in", async (t) => {
  const indiekit = await Indiekit.initialize();
  gitea.init(indiekit);

  t.is(indiekit.publication.store.info.name, "username/repo on Gitea");
});

test("Creates file in a repository", async (t) => {
  const result = await gitea.createFile("foo.md", "foo", "Message");

  t.true(result);
});

test("Creates file in a repository at custom instance", async (t) => {
  await mockAgent("store-gitea", {
    instance: "https://gitea.instance",
  });
  const result = await giteaInstance.createFile("foo.md", "foo", "Message");

  t.true(result);
});

test("Throws error creating file in a repository", async (t) => {
  await t.throwsAsync(gitea.createFile("401.md", "foo", "Message"), {
    message: "Gitea store: Unauthorized",
  });
});

test("Reads file in a repository", async (t) => {
  const result = await gitea.readFile("foo.md");

  t.is(result, "foobar");
});

test("Throws error reading file in a repository", async (t) => {
  await t.throwsAsync(gitea.readFile("404.md"), {
    message: "Gitea store: Not Found",
  });
});

test.serial("Updates file in a repository", async (t) => {
  const result = await gitea.updateFile("foo.md", "foo", "Message");

  t.true(result);
});

test("Throws error updating file in a repository", async (t) => {
  await t.throwsAsync(gitea.updateFile("401.md", "foo", "Message"), {
    message: "Gitea store: Unauthorized",
  });
});

test.serial("Deletes a file in a repository", async (t) => {
  const result = await gitea.deleteFile("foo.md", "Message");

  t.true(result);
});

test("Throws error deleting a file in a repository", async (t) => {
  await t.throwsAsync(gitea.deleteFile("401.md", "Message"), {
    message: "Gitea store: Unauthorized",
  });
});
