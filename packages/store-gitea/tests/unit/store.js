import test from "ava";
import { setGlobalDispatcher } from "undici";
import { Indiekit } from "@indiekit/indiekit";
import { giteaAgent } from "@indiekit-test/mock-agent";
import GiteaStore from "../../index.js";

setGlobalDispatcher(giteaAgent());

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

test("Initiates plug-in", (t) => {
  const indiekit = new Indiekit();
  gitea.init(indiekit);

  t.is(indiekit.publication.store.info.name, "username/repo on Gitea");
});

test("Creates file in a repository", async (t) => {
  const result = await gitea.createFile("foo.txt", "foo", "Message");

  t.true(result);
});

test("Creates file in a repository at custom instance", async (t) => {
  setGlobalDispatcher(giteaAgent("https://gitea.instance"));
  const result = await giteaInstance.createFile("foo.txt", "foo", "Message");

  t.true(result);
});

test("Throws error creating file in a repository", async (t) => {
  await t.throwsAsync(gitea.createFile("foo.txt", "foo", "Message"), {
    message: "Gitea store: Not Found",
  });
});

test("Reads file in a repository", async (t) => {
  const result = await gitea.readFile("foo.txt");

  t.is(result, "foobar");
});

test("Throws error reading file in a repository", async (t) => {
  await t.throwsAsync(gitea.readFile("foo.txt"), {
    message: "Gitea store: Not Found",
  });
});

test("Updates file in a repository", async (t) => {
  const result = await gitea.updateFile("foo.txt", "foo", "Message");

  t.true(result);
});

test("Throws error updating file in a repository", async (t) => {
  await t.throwsAsync(gitea.updateFile("foo.txt", "foo", "Message"), {
    message: "Gitea store: Not Found",
  });
});

test("Deletes a file in a repository", async (t) => {
  const result = await gitea.deleteFile("foo.txt", "Message");

  t.true(result);
});

test("Throws error deleting a file in a repository", async (t) => {
  await t.throwsAsync(gitea.deleteFile("foo.txt", "Message"), {
    message: "Gitea store: Not Found",
  });
});
