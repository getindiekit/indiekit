import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /session/login", () => {
  it("Login redirects authenticated user to homepage", async () => {
    const result = await request
      .get("/session/login")
      .set("cookie", testCookie());

    assert.equal(result.headers.location, "/");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
