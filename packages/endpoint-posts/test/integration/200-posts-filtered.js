import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

await mockAgent("endpoint-posts");
const server = await testServer({
  application: { micropubEndpoint: "https://micropub-endpoint.example" },
});
const request = supertest.agent(server);

describe("endpoint-posts GET /posts?post-type=*&filter=*", () => {
  it("Returns posts filtered by post type and text", async () => {
    const response = await request
      .get("/posts")
      .query({ "post-type": "bookmark", filter: "lunch & dinner" })
      .set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;

    assert.equal(
      document.querySelector(".card__title a").textContent.trim(),
      "Lunch spots",
    );
    assert.equal(
      document.querySelector('[name="post-type"] option[selected]').value,
      "bookmark",
    );
    assert.equal(
      document.querySelector('[name="filter"]').value,
      "lunch & dinner",
    );
  });

  it("Keeps filters in pagination links", async () => {
    const response = await request
      .get("/posts")
      .query({ "post-type": "bookmark", filter: "lunch & dinner" })
      .set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;
    const href = document
      .querySelector(".pagination__item--next a")
      .getAttribute("href");
    const next = new URL(href, "https://website.example/posts");

    assert.equal(next.searchParams.get("post-type"), "bookmark");
    assert.equal(next.searchParams.get("filter"), "lunch & dinner");
    assert.equal(next.searchParams.get("after"), "456");
  });

  it("Says when no posts match the filters", async () => {
    const response = await request
      .get("/posts")
      .query({ "post-type": "photo" })
      .set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;

    assert.ok(!document.querySelector(".card"));
    assert.match(document.querySelector("main").textContent, /No posts match/);
  });

  after(() => server.close());
});
