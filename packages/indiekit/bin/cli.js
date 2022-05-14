#!/usr/bin/env node
import fs from "node:fs";
import process from "node:process";
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
  .option("-d, --debug [scope]", "enable debugging")
  .option("-p, --port <port>", "port to bind on", defaultConfig.server.port)
  .action((options) => {
    if (options.debug) {
      process.env.DEBUG = options.debug ? `${options.debug}:*` : "*";
    }

    const indiekit = new Indiekit({
      configFilePath: program.opts().config,
    });

    // https://web.dev/how-to-use-local-https
    if (process.env.NODE_ENV === "development") {
      options.key = fs.readFileSync("localhost-key.pem");
      options.cert = fs.readFileSync("localhost.pem");
    }

    indiekit.server(options);
  });

program.parse();
