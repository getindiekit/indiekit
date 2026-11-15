import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { testConfig } from "@indiekit-test/config";
import { mockRequest, mockResponse } from "mock-req-res";

import { Indiekit } from "../../index.js";
import { getNavigation } from "../../lib/navigation.js";

const indiekit = await Indiekit.initialize({ config: await testConfig() });
indiekit.addEndpoint({
  id: "foo",
  init() {},
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
});

const response = mockResponse({
  locals: { __: (/** @type {string} */ value) => value },
});

describe("indiekit/lib/navigation", () => {
  it("Returns logged out navigation", () => {
    const result = getNavigation(
      indiekit,
      mockRequest({ path: "/bar", session: {} }),
      response,
    );

    assert.equal(result[1].href, "/session/login");
  });

  it("Returns navigation items that require a database", () => {
    const result = getNavigation(
      indiekit,
      mockRequest({ path: "/bar", session: {} }),
      response,
    );

    assert.notEqual(result[0].href, "/foo");
    assert.equal(result[0].href, "/bar");
  });

  it("Returns logged in navigation", () => {
    const result = getNavigation(
      indiekit,
      mockRequest({ path: "/bar", session: { access_token: "token" } }),
      response,
    );

    assert.equal(result[1].href, "/session/logout");
  });

  it("Indicates current item in navigation", () => {
    const result = getNavigation(
      indiekit,
      mockRequest({ path: "/bar", session: { access_token: "token" } }),
      response,
    );

    assert.equal(result[0].href, "/bar");
    assert.ok(result[0].attributes);
    assert.equal(result[0].attributes["aria-current"], "true");
  });
});
