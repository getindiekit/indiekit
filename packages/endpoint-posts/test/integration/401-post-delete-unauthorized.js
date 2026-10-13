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

describe("endpoint-files POST /posts/:uid/delete", () => {
  it("Returns 401 error deleting post", async () => {
    const response = await request
      .post(`/posts/401/delete`)
      .set("cookie", testCookie())
      .send({ url: "https://website.example/401" });
    const { document } = new JSDOM(response.text).window;
    const $p = document.querySelector(`notification-banner[type="error"] p`);

    assert.equal(response.status, 401);
    assert.ok($p, "p element not found");
    assert.match($p.textContent, /Unauthorized/);
  });

  after(() => server.close());
});
