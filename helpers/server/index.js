import { mock } from "node:test";

import { Indiekit } from "@indiekit/indiekit";
import { testConfig } from "@indiekit-test/config";
import getPort from "get-port";

/**
 * Start a test server
 * @param {Parameters<typeof testConfig>[0]} [options] - Configuration options
 * @returns {Promise<Server>} Server
 */
export const testServer = async (options) => {
  mock.method(console, "info", () => {}); // Disable console.info
  mock.method(console, "warn", () => {}); // Disable console.warn

  const config = await testConfig(options);
  const indiekit = await Indiekit.initialize({ config });
  const port = await getPort();
  const server = await indiekit.server({ port });

  return server;
};

/**
 * @import { Server } from "node:http"
 */
