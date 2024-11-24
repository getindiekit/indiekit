#!/usr/bin/env node
import { createRequire } from "node:module";
import { Command } from "commander";
import makeDebug from "debug";
import { Indiekit } from "@indiekit/indiekit";
import { defaultConfig } from "../config/defaults.js";

const require = createRequire(import.meta.url);
const package_ = require("../package.json");
const program = new Command();

program
  .version(package_.version)
  .option("-c, --config <path>", "path to configuration file");

program
  .command("serve")
  .description("start the indiekit server")
  .option("-d, --debug [scope]", "enable debugging")
  .option(
    "-p, --port <port>",
    "port to bind on",
    defaultConfig.application.port,
  )
  .action(async (options) => {
    const { debug, port } = options;

    if (debug) {
      // Debug everything if no scope, else only debug within provided scope
      makeDebug.enable(debug === true ? `*` : debug);
    }

    const indiekit = await Indiekit.initialize({
      configFilePath: program.opts().config,
    });

    indiekit.server({ port });
  });

program.parse();
