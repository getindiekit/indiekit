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

  it("Exits process if no publication URL in configuration", async () => {
    mock.method(console, "error", () => {});
    mock.method(console, "info", () => {});
    mock.method(process, "exit", () => {});

    publication.me = undefined;
    await assert.rejects(indiekit.server({ port: 1234 }));
    const result = console.error.mock.calls[0].arguments[0];

    assert.equal(result.includes("No publication URL in configuration"), true);
    assert.equal(process.exit.mock.calls.length, 1);
  });

  it("Returns a server bound to given port", async () => {
    mock.method(console, "info", () => {});
    publication.me = "https://website.example";
    const result = await indiekit.server({ port: 1234 });

    assert.match(result._connectionKey, /::::1234/);

    result.close();
  });
});
