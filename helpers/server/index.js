import { mock } from "node:test";

import "dotenv/config.js";
import { Indiekit } from "@indiekit/indiekit";
import { testConfig } from "@indiekit-test/config";
import { testDatabase } from "@indiekit-test/database";
import getPort from "get-port";

const { mongoUri } = await testDatabase();
const defaultOptions = { mongodbUrl: mongoUri };

export const testServer = async (options) => {
  options = { ...defaultOptions, ...options };

  mock.method(console, "info", () => {}); // Disable console.info
  mock.method(console, "warn", () => {}); // Disable console.warn

  const config = await testConfig(options);
  const indiekit = await Indiekit.initialize({ config });
  const port = await getPort();
  const server = await indiekit.server({ port });

  return server;
};
