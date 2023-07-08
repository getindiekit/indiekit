import "dotenv/config.js";
import getPort from "get-port";
import sinon from "sinon";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "@indiekit/indiekit";

export const testServer = async (options) => {
  sinon.stub(console, "info"); // Disable console.info
  sinon.stub(console, "warn"); // Disable console.warn
  const config = await testConfig(options);
  const indiekit = await Indiekit.initialize({ config });
  const server = await indiekit.server({
    port: await getPort(),
  });

  return server;
};
