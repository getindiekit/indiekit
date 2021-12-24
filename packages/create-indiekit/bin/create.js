#!/usr/bin/env node
import process from "node:process";
import { checkNodeVersion } from "../lib/utils.js";

checkNodeVersion(process.versions.node, 16);

// eslint-disable-next-line node/no-unsupported-features/es-syntax
import("../index.js").then(({ init }) => init());
