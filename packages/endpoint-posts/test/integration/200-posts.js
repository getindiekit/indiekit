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

describe("endpoint-posts GET /posts", () => {
  it("Returns list of published posts", async () => {
    const response = await request.get("/posts").set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;
    const $a = document.querySelector(".card__title a");

    assert.ok($a, "a element not found");
    assert.equal($a.textContent.includes("Foobar"), true);
  });

  after(() => server.close());
});
