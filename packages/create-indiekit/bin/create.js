#!/usr/bin/env node
import process from "node:process";

import { init } from "../index.js";
import { isCompatibleNodeVersion } from "../lib/utils.js";

if (!isCompatibleNodeVersion(process.versions.node, 20)) {
  console.info(`Node.js v${process.versions.node} is not supported.`);
  console.info(`Please use Node.js v${20} or higher.`);
  process.exit(1);
}

await init();
