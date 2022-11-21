#!/usr/bin/env node
import { createRequire } from "node:module";
import create from "base-create";
import chalk from "chalk";
import prompts from "prompts";
import { setupPrompts } from "./lib/setup-prompts.js";
import { addPluginConfig } from "./lib/utils.js";

const require = createRequire(import.meta.url);
const { name, version, bugs } = require("./package.json");

const nodeVersion = 18;

/**
 * @returns {Function} init
 */
export async function init() {
  const { log } = console;
  const bugsUrl = chalk.cyan(`${bugs.url}`);
  const nameVersion = chalk.white(`(${name} v${version})`);

  log(`\n${chalk.bold("Welcome to Indiekit!")} ${nameVersion}`);
  log(`If you encounter a problem, visit ${bugsUrl} to file a new issue.\n`);
  log(`${chalk.green(">")} ${chalk.white("Gathering details…")}`);

  // Ask setup questions
  const setup = await prompts(setupPrompts);

  const { me, presetPlugin, storePlugin, syndicatorPlugins } = setup;
  const dependencies = ["@indiekit/indiekit"];
  const config = {
    plugins: [],
    publication: { me },
  };

  if (presetPlugin) {
    dependencies.push(presetPlugin);
    await addPluginConfig(presetPlugin, config);
  }

  if (storePlugin) {
    dependencies.push(storePlugin);
    await addPluginConfig(storePlugin, config);
  }

  if (syndicatorPlugins) {
    for await (const syndicatorPlugin of syndicatorPlugins) {
      dependencies.push(syndicatorPlugin);
      await addPluginConfig(syndicatorPlugin, config);
    }
  }

  create({
    dependencies,
    files: [
      {
        path: "README.md",
        contents: `# Indiekit server for ${me}\n\nLearn more at <https://getindiekit.com>\n`,
      },
      {
        path: ".gitignore",
        contents: "node_modules/",
      },
      {
        path: ".indiekitrc.json",
        contents: config,
      },
    ],
    package: {
      description: `Indiekit server for ${me}`,
      keywords: ["indiekit", "indieweb"],
      scripts: {
        start: "indiekit serve",
      },
      engines: {
        node: nodeVersion.toString(),
      },
      type: "module",
    },
    skipGitignore: true,
  });
}
