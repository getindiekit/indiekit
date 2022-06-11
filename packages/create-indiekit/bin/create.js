#!/usr/bin/env node
import process from "node:process";
import { checkNodeVersion } from "../lib/utils.js";

checkNodeVersion(process.versions.node, 16);

import("../index.js").then(({ init }) => init());
