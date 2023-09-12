import test from "ava";
import { Indiekit } from "@indiekit/indiekit";
import { mockAgent } from "@indiekit-test/mock-agent";
import GithubStore from "../index.js";

await mockAgent("store-github");

const github = new GithubStore({
  token: "abcd1234",
  user: "user",
  repo: "repo",
});

test("Gets plug-in environment", (t) => {
  t.deepEqual(github.environment, ["GITHUB_TOKEN"]);
});

test("Gets plug-in info", (t) => {
  t.is(github.name, "GitHub store");
  t.is(github.info.name, "user/repo on GitHub");
  t.is(github.info.uid, "https://github.com/user/repo");
});

test("Gets plug-in installation prompts", (t) => {
  t.is(github.prompts[0].message, "What is your GitHub username?");
});

test("Initiates plug-in", async (t) => {
  const indiekit = await Indiekit.initialize();
  github.init(indiekit);

  t.is(indiekit.publication.store.info.name, "user/repo on GitHub");
});

test("Creates file", async (t) => {
  const result = await github.createFile("foo.md", "foobar", {
    message: "Message",
  });
  t.is(result, "https://github.com/user/repo/blob/main/foo.txt");
});

test("Throws error creating file", async (t) => {
  await t.throwsAsync(
    github.createFile("401.md", "foobar", { message: "Message" }),
    {
      message: "GitHub store: Unauthorized",
    },
  );
});

test("Reads file", async (t) => {
  t.is(await github.readFile("foo.md", { message: "Message" }), "foobar");
});

test("Throws error reading file", async (t) => {
  await t.throwsAsync(github.readFile("404.md", { message: "Message" }), {
    message: "GitHub store: Not Found",
  });
});

test("Updates file", async (t) => {
  const result = await github.updateFile("foo.md", "foobar", {
    message: "Message",
  });
  t.is(result, "https://github.com/user/repo/blob/main/foo.txt");
});

test("Updates and renames file", async (t) => {
  const result = await github.updateFile("foo.md", "qux", {
    message: "Message",
    newPath: "bar.md",
  });
  t.is(result, "https://github.com/user/repo/blob/main/bar.txt");
});

test("Creates file if original Not Found in repository", async (t) => {
  const result = await github.updateFile("bar.md", "foobar", {
    message: "Message",
  });
  t.is(result, "https://github.com/user/repo/blob/main/bar.txt");
});

test("Throws error updating file", async (t) => {
  await t.throwsAsync(
    github.updateFile("401.md", "foobar", { message: "Message" }),
    {
      message: "GitHub store: Unauthorized",
    },
  );
});

test("Deletes a file", async (t) => {
  t.true(await github.deleteFile("foo.md", { message: "Message" }));
});

test("Throws error file Not Found in repository", async (t) => {
  await t.throwsAsync(github.deleteFile("404.md", { message: "Message" }), {
    message: "GitHub store: Not Found",
  });
});

test("Throws error deleting a file", async (t) => {
  await t.throwsAsync(github.deleteFile("401.md", { message: "Message" }), {
    message: "GitHub store: Unauthorized",
  });
});
