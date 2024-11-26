import { strict as assert } from "node:assert";
import { after, before, describe, it, mock } from "node:test";

import { testConfig } from "@indiekit-test/config";
import { testDatabase } from "@indiekit-test/database";
import TestStore from "@indiekit-test/store";

import { Indiekit } from "../index.js";

describe("indiekit", async () => {
  let indiekit;
  const { client, mongoServer, mongoUri } = await testDatabase();

  before(async () => {
    mock.method(console, "info", () => {});
    const config = await testConfig({ mongodbUrl: mongoUri });
    indiekit = await Indiekit.initialize({ config });
    await indiekit.connectMongodbClient();
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    indiekit.closeMongodbClient();
  });

  it("Adds database collection", async () => {
    indiekit.addCollection("test");

    assert.equal(indiekit.collections.has("test"), true);
  });

  it("Doesn’t allow duplicate database collections", async () => {
    mock.method(console, "warn", () => {});

    indiekit.addCollection("test");
    const result = console.warn.mock.calls[0].arguments[0];

    assert.equal(result.includes(`Collection ‘test’ already added`), true);
  });

  it("Adds endpoint", () => {
    const TestEndpoint = class {
      constructor() {
        this.name = "Test endpoint";
      }
    };

    const testEndpoint = new TestEndpoint();
    indiekit.addEndpoint(testEndpoint);

    assert.equal([...indiekit.endpoints].at(-1).name, "Test endpoint");
  });

  it("Adds publication preset", () => {
    const TestPreset = class {
      constructor() {
        this.name = "Test preset";
      }

      get info() {
        return { name: "Test" };
      }
    };

    const testPreset = new TestPreset();
    indiekit.addPreset(testPreset);

    assert.equal(indiekit.publication.preset.info.name, "Test");
  });

  it("Adds content store", () => {
    const testStore = new TestStore();
    indiekit.addStore(testStore);

    assert.equal([...indiekit.stores][0].info.name, "Test store");
  });
});
