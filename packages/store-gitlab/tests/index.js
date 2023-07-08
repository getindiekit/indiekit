import test from "ava";
import { Indiekit } from "@indiekit/indiekit";
import { mockAgent } from "@indiekit-test/mock-agent";
import GitlabStore from "../index.js";

await mockAgent("gitlab");

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
  const result = await gitlab.createFile("foo.txt", "foo", "Message");

  t.true(result);
});

test("Creates file in a repository with projectId at custom instance", async (t) => {
  await mockAgent("gitlab", {
    projectId: "1234",
    instance: "https://gitlab.instance",
  });
  const result = await gitlabInstance.createFile("foo.txt", "foo", "Message");

  t.true(result);
});

test("Throws error creating file in a repository", async (t) => {
  await t.throwsAsync(gitlab.createFile("foo.txt", "foo", "Message"), {
    message: "GitLab store: Not Found",
  });
});

test("Reads file in a repository", async (t) => {
  const result = await gitlab.readFile("foo.txt");

  t.is(result, "foobar");
});

test("Throws error reading file in a repository", async (t) => {
  await t.throwsAsync(gitlab.readFile("foo.txt"), {
    message: "GitLab store: Not Found",
  });
});

test("Updates file in a repository", async (t) => {
  const result = await gitlab.updateFile("foo.txt", "foo", "Message");

  t.true(result);
});

test("Throws error updating file in a repository", async (t) => {
  await t.throwsAsync(gitlab.updateFile("foo.txt", "foo", "Message"), {
    message: "GitLab store: Not Found",
  });
});

test("Deletes a file in a repository", async (t) => {
  const result = await gitlab.deleteFile("foo.txt", "Message");

  t.true(result);
});

test("Throws error deleting a file in a repository", async (t) => {
  await t.throwsAsync(gitlab.deleteFile("foo.txt", "Message"), {
    message: "GitLab store: Not Found",
  });
});
