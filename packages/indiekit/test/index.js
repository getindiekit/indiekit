import { strict as assert } from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";
import { testConfig } from "@indiekit-test/config";
import TestStore from "@indiekit-test/store";
import { Indiekit } from "../index.js";

describe("indiekit", () => {
  let indiekit;
  let application, publication;

  beforeEach(async () => {
    const config = await testConfig();
    indiekit = await Indiekit.initialize({ config });
    const bootstrappedConfig = await indiekit.bootstrap();
    application = bootstrappedConfig.application;
    publication = bootstrappedConfig.publication;
  });

  it("Gets application configuration value", () => {
    assert.equal(application.name, "Test configuration");
  });

  it("Gets publication configuration values", () => {
    assert.equal(publication.slugSeparator, "-");
    assert.equal(publication.me, "https://website.example");
  });

  it("Adds endpoint", () => {
    const TestEndpoint = class {
      constructor() {
        this.name = "Test endpoint";
      }
    };

    const testEndpoint = new TestEndpoint();
    indiekit.addEndpoint(testEndpoint);

    assert.equal(indiekit.application.endpoints.at(-1).name, "Test endpoint");
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

    assert.equal(indiekit.application.stores[0].info.name, "Test store");
  });

  it("Exits process if no publication URL in configuration", async () => {
    mock.method(console, "error", () => {});
    mock.method(process, "exit", () => {});

    publication.me = undefined;
    await assert.rejects(indiekit.server({ port: 1234 }));
    const result = console.error.mock.calls[0].arguments[0];

    assert.equal(result.includes("No publication URL in configuration"), true);
    assert.equal(process.exit.mock.calls.length, 1);
  });

  it("Returns a server bound to given port", async () => {
    mock.method(console, "info", () => {});
    const result = await indiekit.server({ port: 1234 });

    assert.match(result._connectionKey, /::::1234/);

    result.close();
  });
});
