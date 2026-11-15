import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { testConfig } from "@indiekit-test/config";
import { mockResponse } from "mock-req-res";

import { Indiekit } from "../../index.js";
import { getShortcuts } from "../../lib/shortcuts.js";

const indiekit = await Indiekit.initialize({ config: await testConfig() });
indiekit.addEndpoint({
  id: "foo",
  init() {},
  name: "Foo plug-in",
  shortcutItems: [
    {
      url: "/foo",
      name: "Foo",
      requiresDatabase: true,
    },
    {
      url: "/bar",
      name: "Bar",
    },
  ],
});

const response = mockResponse({
  locals: { __: (/** @type {string} */ value) => value },
});

describe("indiekit/lib/shortcuts", () => {
  it("Returns shortcut items that require a database", () => {
    const result = getShortcuts(indiekit, response);

    assert.notEqual(result[0].url, "/foo");
    assert.equal(result[0].url, "/bar");
  });
});
