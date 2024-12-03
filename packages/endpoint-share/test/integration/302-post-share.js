import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

await mockAgent("endpoint-micropub");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-share POST /share", () => {
  it("Posts content and redirects back to share page", async () => {
    const result = await request
      .post("/share")
      .set("cookie", testCookie())
      .send(`access_token=${testToken()}`)
      .send("name=Foobar")
      .send("content=Test+of+sharing+a+bookmark")
      .send("bookmark-of=https://example.website");

    assert.equal(result.status, 302);
  });

  after(() => server.close());
});
