import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-posts GET /posts", () => {
  it("Returns no published posts (no database)", async () => {
    const response = await request.get("/posts").set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");
    const $p = document.querySelector(".main__container p");

    assert.ok($title, "title element not found");
    assert.equal($title.textContent, "Published posts - Test configuration");
    assert.ok($p, "p element not found");
    assert.match($p.textContent, /No posts/);
  });

  after(() => server.close());
});
