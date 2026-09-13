import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

const value = (dom, selector) =>
  dom.window.document.querySelector(selector)?.value;

describe("endpoint-posts GET /posts/create?url=&name=", () => {
  it("Pre-fills the URL field and name of a bookmark", async () => {
    const response = await request
      .get("/posts/create")
      .set("cookie", testCookie())
      .query({ type: "bookmark" })
      .query({ url: "https://example.website/article" })
      .query({ name: "An article" });
    const dom = new JSDOM(response.text);

    assert.equal(
      value(dom, '[name="bookmark-of"]'),
      "https://example.website/article",
    );
    assert.equal(value(dom, '[name="name"]'), "An article");
  });

  it("Puts the URL in the content of a post type with no URL field", async () => {
    const response = await request
      .get("/posts/create")
      .set("cookie", testCookie())
      .query({ type: "note" })
      .query({ url: "https://example.website/article" });
    const dom = new JSDOM(response.text);

    assert.equal(
      value(dom, '[name="content"]'),
      "https://example.website/article",
    );
  });

  it("Ignores a name for a post type with no name field", async () => {
    const response = await request
      .get("/posts/create")
      .set("cookie", testCookie())
      .query({ type: "note" })
      .query({ name: "Not a note title" });
    const dom = new JSDOM(response.text);

    assert.equal(value(dom, '[name="name"]'), undefined);
    assert.equal(value(dom, '[name="content"]'), "");
  });

  after(() => server.close());
});
