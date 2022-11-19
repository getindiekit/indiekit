#!/usr/bin/env node
import process from "node:process";
import { init } from "../index.js";
import { checkNodeVersion } from "../lib/utils.js";

checkNodeVersion(process.versions.node, 16);

await init();
