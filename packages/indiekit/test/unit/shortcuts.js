import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { mockResponse } from "mock-req-res";
import { getShortcuts } from "../../lib/shortcuts.js";

const application = {
  hasDatabase: false,
  installedPlugins: [],
  locale: "en",
  endpoints: [
    {
      id: "foo",
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
    },
  ],
};
const response = mockResponse({
  locals: { __: (value) => value },
});

describe("indiekit/lib/shortcuts", () => {
  it("Returns shortcut items that require a database", () => {
    const result = getShortcuts(application, response);

    assert.notEqual(result[0].url, "/foo");
    assert.equal(result[0].url, "/bar");
  });
});
