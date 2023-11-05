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

test("Gets plug-in environment", (t) => {
  t.deepEqual(gitea.environment, ["GITEA_TOKEN"]);
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

test("Creates file", async (t) => {
  const result = await gitea.createFile("foo.md", "foo", {
    message: "Message",
  });

  t.is(result, "https://gitea.com/username/repo/foo.md");
});

test("Creates file at custom instance", async (t) => {
  const result = await giteaInstance.createFile("foo.md", "foo", {
    message: "Message",
  });

  t.is(result, "https://gitea.instance/username/repo/foo.md");
});

test("Throws error creating file", async (t) => {
  await t.throwsAsync(
    gitea.createFile("401.md", "foo", { message: "Message" }),
    {
      message: "Gitea store: Unauthorized",
    },
  );
});

test("Reads file", async (t) => {
  const result = await gitea.readFile("foo.md");

  t.is(result, "foobar");
});

test("Throws error reading file", async (t) => {
  await t.throwsAsync(gitea.readFile("404.md"), {
    message: "Gitea store: Not found",
  });
});

test.serial("Updates file", async (t) => {
  const result = await gitea.updateFile("foo.md", "foo", {
    message: "Message",
  });

  t.is(result, "https://gitea.com/username/repo/foo.md");
});

test.serial("Updates and renames file", async (t) => {
  const result = await gitea.updateFile("foo.md", "foo", {
    message: "Message",
    newPath: "bar.md",
  });

  t.is(result, "https://gitea.com/username/repo/bar.md");
});

test("Throws error updating file", async (t) => {
  await t.throwsAsync(
    gitea.updateFile("401.md", "foo", { message: "Message" }),
    {
      message: "Gitea store: Unauthorized",
    },
  );
});

test.serial("Deletes a file", async (t) => {
  const result = await gitea.deleteFile("foo.md", { message: "Message" });

  t.true(result);
});

test("Throws error deleting a file", async (t) => {
  await t.throwsAsync(gitea.deleteFile("401.md", { message: "Message" }), {
    message: "Gitea store: Unauthorized",
  });
});
