import "dotenv/config.js"; // eslint-disable-line import/no-unassigned-import
import supertest from "supertest";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "@indiekit/indiekit";

export const testServer = async (options) => {
  const config = await testConfig(options);
  const indiekit = new Indiekit({ config });
  const app = await indiekit.createApp();
  const server = supertest.agent(app);

  return server;
};
