import { after, before, describe, mock } from "node:test";

import { testConfig } from "@indiekit-test/config";
import { testDatabase } from "@indiekit-test/database";

import { Indiekit } from "../index.js";

describe("indiekit", async () => {
  let indiekit;
  const { client, mongoServer, mongoUri } = await testDatabase();

  before(async () => {
    mock.method(console, "info", () => {});
    const config = await testConfig({ application: { mongodbUrl: mongoUri } });
    indiekit = await Indiekit.initialize({ config });
    await indiekit.connectMongodbClient();
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    indiekit.closeMongodbClient();
  });
});
