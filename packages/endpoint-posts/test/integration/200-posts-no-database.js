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
    const dom = new JSDOM(response.text);
    const result = dom.window.document;

    assert.equal(
      result.querySelector("title").textContent,
      "Published posts - Test configuration",
    );
    assert.match(
      result.querySelector(".main__container p").textContent,
      /No posts/,
    );
  });

  after(() => server.close());
});
