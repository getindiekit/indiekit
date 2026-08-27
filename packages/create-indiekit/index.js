import { createRequire } from "node:module";
import { styleText } from "node:util";

import create from "base-create";
import prompts from "prompts";

import { getFiles } from "./lib/files.js";
import { getPackageValues } from "./lib/package.js";
import { setupPrompts } from "./lib/setup-prompts.js";

const require = createRequire(import.meta.url);
const { name, version, bugs } = require("./package.json");

const nodeVersion = ">=24";

/**
 * @returns {Promise<object>} init
 */
export async function init() {
  const { log } = console;
  const bugsUrl = styleText("cyan", bugs.url);
  const nameVersion = styleText("white", `(${name} v${version})`);

  log(`\n${styleText("bold", "Welcome to Indiekit!")} ${nameVersion}`);
  log(`If you encounter a problem, visit ${bugsUrl} to file a new issue.\n`);
  log(`${styleText("green", ">")} ${styleText("white", "Gathering details…")}`);

  // Ask setup questions
  //
  // Without `onCancel`, cancelling resolves with whatever has been answered so
  // far, so a cancelled run carries on and scaffolds using empty answers.
  const setup = await prompts(setupPrompts, {
    onCancel() {
      const error = new Error("Setup cancelled.");
      error.code = "ERR_SETUP_CANCELLED";

      throw error;
    },
  });

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
