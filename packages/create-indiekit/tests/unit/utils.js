import process from "node:process";
import test from "ava";
import sinon from "sinon";
import {
  addPluginConfig,
  checkNodeVersion,
  getPlugin,
} from "../../lib/utils.js";

test("Adds plug-in to Indiekit configuration", async (t) => {
  const result = await addPluginConfig("@indiekit/preset-jekyll", {
    plugins: [],
  });

  t.deepEqual(result, {
    "@indiekit/preset-jekyll": {},
    plugins: ["@indiekit/preset-jekyll"],
  });
});

test("Checks if Node.js version meets minimum requirement", (t) => {
  sinon.stub(console, "info");
  sinon.stub(process, "exit");
  checkNodeVersion("12.15", 16);

  t.true(console.info.calledWith("Node.js v12.15 is not supported."));
  t.true(console.info.calledWith("Please use Node.js v16 or higher."));
  t.true(process.exit.calledWith(1));
});

test("Gets question prompts specified by plug-in", async (t) => {
  const { name, prompts } = await getPlugin("@indiekit/preset-hugo");

  t.is(name, "Hugo preset");
  t.is(prompts[0].message, "Which front matter format are you using?");
  t.is(prompts[0].type, "select");
});
