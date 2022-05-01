import test from "ava";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "../index.js";

test.beforeEach(async (t) => {
  const config = await testConfig();
  const indiekit = new Indiekit({ config });
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

test("Throws error adding an extension with an unknown type", (t) => {
  t.throws(
    () => {
      t.context.indiekit.extend("foo", []);
    },
    {
      name: "TypeError",
      message: "foo is not a valid extension type",
    }
  );
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

test("Creates an express application", async (t) => {
  const result = await t.context.indiekit.createApp();

  t.truthy(result.locals);
});

test("Returns a server bound to given port", async (t) => {
  const result = await t.context.indiekit.server({ port: 1234 });

  t.regex(result._connectionKey, /::::1234/);
});
