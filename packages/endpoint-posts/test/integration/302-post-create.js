import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import supertest from "supertest";

await mockAgent("endpoint-micropub");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-posts POST /posts/create", () => {
  it("Creates post and redirects to posts page", async () => {
    const result = await request
      .post("/posts/create")
      .type("form")
      .set("cookie", testCookie())
      .send({ type: "entry" })
      .send({ content: "Foobar" })
      .send({ published: "2023-08-28T12:30" });

    assert.equal(result.status, 302);
    assert.match(result.text, /Found. Redirecting to \/posts\?success/);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
