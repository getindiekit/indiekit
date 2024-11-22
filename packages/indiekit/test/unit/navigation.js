import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { mockResponse } from "mock-req-res";
import { getNavigation } from "../../lib/navigation.js";

const application = {
  installedPlugins: [],
  locale: "en",
  endpoints: [
    {
      id: "foo",
      name: "Foo plug-in",
      navigationItems: [
        {
          href: "/foo",
          text: "Foo",
          requiresDatabase: true,
        },
        {
          href: "/bar",
          text: "Bar",
        },
      ],
    },
  ],
};
const response = mockResponse({
  locals: { __: (value) => value },
});

describe("indiekit/lib/navigation", () => {
  it("Returns logged out navigation", () => {
    const result = getNavigation(
      application,
      { path: "/bar", session: {} },
      response,
    );

    assert.equal(result[1].href, "/session/login");
  });

  it("Returns navigation items that require a database", () => {
    const result = getNavigation(
      application,
      { path: "/bar", session: {} },
      response,
    );

    assert.notEqual(result[0].href, "/foo");
    assert.equal(result[0].href, "/bar");
  });

  it("Returns logged in navigation", () => {
    const result = getNavigation(
      application,
      { path: "/bar", session: { access_token: "token" } },
      response,
    );

    assert.equal(result[1].href, "/session/logout");
  });

  it("Indicates current item in navigation", () => {
    const result = getNavigation(
      application,
      { path: "/bar", session: { access_token: "token" } },
      response,
    );

    assert.equal(result[0].href, "/bar");
    assert.equal(result[0].attributes["aria-current"], "true");
  });
});
