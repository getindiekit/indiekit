import process from "node:process";
import test from "ava";
import sinon from "sinon";
import { getFileContents, getFiles } from "../../lib/files.js";

test("Gets file contents", async (t) => {
  const result = await getFileContents("template.gitignore");

  t.is(result, "node_modules/\n");
});

test("Throws error getting file contents", async (t) => {
  sinon.stub(console, "error");
  sinon.stub(process, "exit");

  await getFileContents("template.foo");

  t.true(
    console.error.calledWith(
      sinon.match((value) =>
        value.includes("ENOENT: no such file or directory"),
      ),
    ),
  );
  t.true(process.exit.calledWith(1));
});

test("Gets files to create", async (t) => {
  const result = await getFiles({ me: "https://website.example" });

  t.deepEqual(result, [
    {
      path: "README.md",
      contents: `# Indiekit server for https://website.example\n\nLearn more at <https://getindiekit.com>\n`,
    },
    {
      path: ".gitignore",
      contents: "node_modules/\n",
    },
  ]);
});

test("Gets files to create, including docker files", async (t) => {
  const result = await getFiles({
    me: "https://website.example",
    useDocker: true,
  });

  t.is(result[2].path, "docker-compose.yml");
  t.is(result[3].path, "Dockerfile");
  t.is(result[4].path, ".dockerignore");
});
