#!/usr/bin/env node
import { createRequire } from "node:module";

import create from "base-create";
import chalk from "chalk";
import prompts from "prompts";

import { getFiles } from "./lib/files.js";
import { getPackageValues } from "./lib/package.js";
import { setupPrompts } from "./lib/setup-prompts.js";

// eslint-ignore import/order
const require = createRequire(import.meta.url);
const { name, version, bugs } = require("./package.json");

const nodeVersion = ">=20";

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

  // Get files to be generated
  const files = await getFiles(setup);

  create({
    dependencies,
    files,
    package: {
      description: `Indiekit server for ${setup.me}`,
      keywords: ["indiekit", "indieweb"],
      scripts: {
        start: "indiekit serve",
      },
      engines: {
        node: nodeVersion,
      },
      type: "module",
      indiekit: config,
    },
    skipGitignore: true,
  });
}
