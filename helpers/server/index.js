import "dotenv/config.js"; // eslint-disable-line import/no-unassigned-import
import getPort from "get-port";
import sinon from "sinon";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "@indiekit/indiekit";

export const testServer = async (options) => {
  sinon.stub(console, "info"); // Disable console.info
  const config = await testConfig(options);
  const indiekit = new Indiekit({ config });
  const server = await indiekit.server({
    port: await getPort(),
  });

  return server;
};
