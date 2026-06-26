import { strict as assert } from "node:assert";
import { before, describe, it, mock } from "node:test";

import { testConfig } from "@indiekit-test/config";

import { Indiekit } from "../index.js";

describe("indiekit server", async () => {
  let indiekit;
  let application, publication;

  before(async () => {
    const config = await testConfig();
    indiekit = await Indiekit.initialize({ config });
    await indiekit.updatePublicationConfig();
    application = indiekit.config.application;
    publication = indiekit.config.publication;
  });

  it("Gets application configuration value", () => {
    assert.equal(application.name, "Test configuration");
  });

  it("Gets publication configuration values", () => {
    assert.equal(publication.slugSeparator, "-");
    assert.equal(publication.me, "https://website.example");
  });

  it("Throws error if no publication URL in configuration", async () => {
    publication.me = undefined;

    await assert.rejects(indiekit.server({ port: 1234 }), (error) => {
      assert.match(error.message, /No publication URL in configuration/);
      return true;
    });
  });

  it("Returns a server bound to given port", async () => {
    mock.method(console, "info", () => {});
    publication.me = "https://website.example";
    const result = await indiekit.server({ port: 1234 });

    assert.match(result._connectionKey, /::::1234/);

    result.close();
  });
});
