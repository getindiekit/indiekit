#!/usr/bin/env node
import { Command } from "commander";
import { Indiekit } from "@indiekit/indiekit";
import { defaultConfig } from "../config/defaults.js";

const program = new Command();

program
  .version(defaultConfig.application.version)
  .option("-c, --config <path>", "path to configuration file");

program
  .command("serve")
  .description("start the indiekit server")
  .option("-p, --port <port>", "port to bind on", defaultConfig.server.port)
  .action((options) => {
    const { port } = options;
    const indiekit = new Indiekit({
      configFilePath: program.opts().config,
    });

    indiekit.server({ port });
  });

program.parse();
