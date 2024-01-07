import { mock } from "node:test";
import "dotenv/config.js";
import getPort from "get-port";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "@indiekit/indiekit";

const defaultOptions = {
  useDatabase: true,
};

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
