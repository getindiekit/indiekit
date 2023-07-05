import process from "node:process";
import test from "ava";
import sinon from "sinon";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "../index.js";

test.beforeEach(async (t) => {
  const config = await testConfig();
  const indiekit = await Indiekit.initialize({ config });
  const { application, publication } = await indiekit.bootstrap();

  t.context = {
    indiekit,
    application,
    publication,
  };
});

test("Gets application configuration value", (t) => {
  t.is(t.context.application.name, "Test configuration");
});

test("Gets publication configuration values", (t) => {
  t.is(t.context.publication.slugSeparator, "-");
  t.is(t.context.publication.postTypes[0].name, "Article");
  t.is(t.context.publication.preset.name, "Jekyll preset");
});

test("Adds endpoint", (t) => {
  const TestEndpoint = class {
    constructor() {
      this.id = "test";
      this.name = "Test endpoint";
    }
  };

  const testEndpoint = new TestEndpoint();

  t.context.indiekit.addEndpoint(testEndpoint);
  t.is(t.context.indiekit.application.endpoints.at(-1).name, "Test endpoint");
});

test("Adds publication preset", (t) => {
  const TestPreset = class {
    constructor() {
      this.id = "test";
      this.name = "Test preset";
    }

    get info() {
      return {
        name: "Test",
      };
    }
  };

  const testPreset = new TestPreset();

  t.context.indiekit.addPreset(testPreset);
  t.is(t.context.indiekit.publication.preset.info.name, "Test");
});

test("Adds content store", (t) => {
  const TestStore = class {
    constructor() {
      this.id = "test";
      this.name = "Test store";
    }

    get info() {
      return {
        name: "Test",
      };
    }
  };

  const testStore = new TestStore();

  t.context.indiekit.addStore(testStore);
  t.is(t.context.indiekit.publication.store.info.name, "Test");
});

test("Exits process if no publication URL in configuration", async (t) => {
  sinon.stub(console, "error");
  sinon.stub(process, "exit");
  t.context.publication.me = undefined;
  await t.throwsAsync(t.context.indiekit.server({ port: 1234 }));

  t.true(console.error.calledWith("No publication URL in configuration"));
});

test("Returns a server bound to given port", async (t) => {
  sinon.stub(console, "info"); // Disable console.info
  const result = await t.context.indiekit.server({ port: 1234 });

  t.regex(result._connectionKey, /::::1234/);
});
