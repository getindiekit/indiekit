import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

await mockAgent("endpoint-posts");
const server = await testServer({
  application: {
    micropubEndpoint: "https://401-post-upload-unauthorized.example",
  },
});
const request = supertest.agent(server);

describe("endpoint-files POST /posts/create", () => {
  it("Returns 401 error creating post", async () => {
    const response = await request
      .post("/posts/create")
      .type("form")
      .set("cookie", testCookie())
      .send({ type: "entry" })
      .send({ content: "Foobar" })
      .send({ published: "2023-08-28T12:30" });
    const { document } = new JSDOM(response.text).window;
    const $p = document.querySelector(`notification-banner[type="error"] p`);

    assert.equal(response.status, 401);
    assert.ok($p, "p element not found");
    assert.match($p.textContent, /Unauthorized/);
  });

  after(() => server.close());
});
