#!/usr/bin/env node
import { createRequire } from "node:module";
import create from "base-create";
import chalk from "chalk";
import prompts from "prompts";
import { setupPrompts } from "./lib/setup-prompts.js";
import { getPackageValues } from "./lib/package.js";
// eslint-ignore import/order
const require = createRequire(import.meta.url);
const { name, version, bugs } = require("./package.json");

const nodeVersion = 18;

/**
 * @returns {Promise<any>} init
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

  // Get values for package.json based on answers
  const { config, dependencies } = await getPackageValues(setup);

  create({
    dependencies,
    files: [
      {
        path: "README.md",
        contents: `# Indiekit server for ${setup.me}\n\nLearn more at <https://getindiekit.com>\n`,
      },
      {
        path: ".gitignore",
        contents: "node_modules/",
      },
    ],
    package: {
      description: `Indiekit server for ${setup.me}`,
      keywords: ["indiekit", "indieweb"],
      scripts: {
        start: "indiekit serve",
      },
      engines: {
        node: nodeVersion.toString(),
      },
      type: "module",
      indiekit: config,
    },
    skipGitignore: true,
  });
}
