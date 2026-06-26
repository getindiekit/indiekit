#!/usr/bin/env node
import process from "node:process";

import { init } from "../index.js";
import { isCompatibleNodeVersion } from "../lib/utils.js";

const minimumMajorVersion = 20;

if (!isCompatibleNodeVersion(process.versions.node, minimumMajorVersion)) {
  console.info(`Node.js v${process.versions.node} is not supported.`);
  console.info(`Please use Node.js v${minimumMajorVersion} or higher.`);
  process.exit(1);
}

await init();
