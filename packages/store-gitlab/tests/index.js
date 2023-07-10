import test from "ava";
import { Indiekit } from "@indiekit/indiekit";
import { mockAgent } from "@indiekit-test/mock-agent";
import GitlabStore from "../index.js";

await mockAgent("store-gitlab");

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

test("Gets plug-in info", (t) => {
  t.is(gitlab.name, "GitLab store");
  t.is(gitlab.info.name, "username/repo on GitLab");
  t.is(gitlab.info.uid, "https://gitlab.com/username/repo");
});

test("Gets plug-in installation prompts", (t) => {
  t.is(gitlab.prompts[0].message, "Where is GitLab hosted?");
});

test("Initiates plug-in", async (t) => {
  const indiekit = await Indiekit.initialize();
  gitlab.init(indiekit);

  t.is(indiekit.publication.store.info.name, "username/repo on GitLab");
});

test("Creates file in a repository", async (t) => {
  const result = await gitlab.createFile("foo.md", "foo", "Message");

  t.true(result);
});

test("Creates file in a repository with projectId at custom instance", async (t) => {
  await mockAgent("store-gitlab", {
    projectId: "1234",
    instance: "https://gitlab.instance",
  });
  const result = await gitlabInstance.createFile("foo.md", "foo", "Message");

  t.true(result);
});

test("Throws error creating file in a repository", async (t) => {
  await t.throwsAsync(gitlab.createFile("401.md", "foo", "Message"), {
    message: "GitLab store: Unauthorized",
  });
});

test("Reads file in a repository", async (t) => {
  const result = await gitlab.readFile("foo.md");

  t.is(result, "foobar");
});

test("Throws error reading file in a repository", async (t) => {
  await t.throwsAsync(gitlab.readFile("401.md"), {
    message: "GitLab store: Unauthorized",
  });
});

test("Updates file in a repository", async (t) => {
  const result = await gitlab.updateFile("foo.md", "foo", "Message");

  t.true(result);
});

test("Throws error updating file in a repository", async (t) => {
  await t.throwsAsync(gitlab.updateFile("401.md", "foo", "Message"), {
    message: "GitLab store: Unauthorized",
  });
});

test("Deletes a file in a repository", async (t) => {
  const result = await gitlab.deleteFile("foo.md", "Message");

  t.true(result);
});

test("Throws error deleting a file in a repository", async (t) => {
  await t.throwsAsync(gitlab.deleteFile("401.md", "Message"), {
    message: "GitLab store: Unauthorized",
  });
});
