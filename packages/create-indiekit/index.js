#!/usr/bin/env node
import { createRequire } from "node:module";
import create from "base-create";
import chalk from "chalk";
import prompts from "prompts";
import { setupPrompts } from "./lib/setup-prompts.js";
import { addPluginConfig } from "./lib/utils.js";

const require = createRequire(import.meta.url);
const package_ = require("./package.json");

const nodeVersion = 16;

/**
 * @returns {Function} init
 */
export async function init() {
  console.log(
    `\n${chalk.bold("Welcome to Indiekit!")} ${chalk.white(
      `(${package_.name} v${package_.version})`
    )}`
  );
  console.log(
    `If you encounter a problem, visit ${chalk.cyan(
      `${package_.bugs.url}`
    )} to search or file a new issue.\n`
  );

  console.log(`${chalk.green(">")} ${chalk.white("Gathering details…")}`);

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
        path: ".nvmrc",
        contents: nodeVersion,
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
