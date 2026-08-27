#!/usr/bin/env node
import process from "node:process";

import { init } from "../index.js";
import { getCliResult, parseCliArguments } from "../lib/cli.js";
import { isCompatibleNodeVersion } from "../lib/utils.js";

const minimumMajorVersion = 20;

if (!isCompatibleNodeVersion(process.versions.node, minimumMajorVersion)) {
  console.info(`Node.js v${process.versions.node} is not supported.`);
  console.info(`Please use Node.js v${minimumMajorVersion} or higher.`);
  process.exit(1);
}

const result = getCliResult(parseCliArguments(process.argv.slice(2)));

if (result) {
  const log = result.code === 0 ? console.info : console.error;

  log(result.message);
  process.exit(result.code);
}

// Setup asks questions, which needs an interactive terminal. Without one,
// `prompts` never settles, so the await below never resolves and Node exits
// reporting an unsettled top-level await instead of anything actionable.
if (!process.stdin.isTTY) {
  console.error("This command needs an interactive terminal.");
  process.exit(1);
}

try {
  await init();
} catch (error) {
  if (error.code === "ERR_SETUP_CANCELLED") {
    console.error(error.message);
    process.exit(1);
  }

  throw error;
}
