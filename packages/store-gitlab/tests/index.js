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

test("Gets plug-in environment", (t) => {
  t.deepEqual(gitlab.environment, ["GITLAB_TOKEN"]);
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

test("Creates file", async (t) => {
  const result = await gitlab.createFile("foo.md", "foo", {
    message: "Message",
  });

  t.is(result, "https://gitlab.com/username/repo/foo.md");
});

test("Creates file with projectId at custom instance", async (t) => {
  await mockAgent("store-gitlab", {
    projectId: "1234",
    instance: "https://gitlab.instance",
  });
  const result = await gitlabInstance.createFile("foo.md", "foo", {
    message: "Message",
  });

  t.is(result, "https://gitlab.instance/projects/1234/foo.md");
});

test("Throws error creating file", async (t) => {
  await t.throwsAsync(
    gitlab.createFile("401.md", "foo", { message: "Message" }),
    {
      message: "GitLab store: Unauthorized",
    },
  );
});

test("Reads file", async (t) => {
  const result = await gitlab.readFile("foo.md");

  t.is(result, "foobar");
});

test("Throws error reading file", async (t) => {
  await t.throwsAsync(gitlab.readFile("401.md"), {
    message: "GitLab store: Unauthorized",
  });
});

test("Updates file", async (t) => {
  const result = await gitlab.updateFile("foo.md", "foo", {
    message: "Message",
  });

  t.is(result, "https://gitlab.com/username/repo/foo.md");
});

test("Updates and renames file", async (t) => {
  const result = await gitlab.updateFile("foo.md", "foo", {
    message: "Message",
    newPath: "bar.md",
  });

  t.is(result, "https://gitlab.com/username/repo/bar.md");
});

test("Throws error updating file", async (t) => {
  await t.throwsAsync(
    gitlab.updateFile("401.md", "foo", { message: "Message" }),
    {
      message: "GitLab store: Unauthorized",
    },
  );
});

test("Deletes a file", async (t) => {
  const result = await gitlab.deleteFile("foo.md", { message: "Message" });

  t.true(result);
});

test("Throws error deleting a file", async (t) => {
  await t.throwsAsync(gitlab.deleteFile("401.md", { message: "Message" }), {
    message: "GitLab store: Unauthorized",
  });
});
