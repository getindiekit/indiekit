import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-posts GET /posts/create", () => {
  it("Redirects to posts page if no create permissions", async () => {
    const result = await request
      .get("/posts/create")
      .set("cookie", testCookie({ scope: "update" }));

    assert.equal(result.status, 302);
    assert.match(result.text, /Found. Redirecting to \/posts/);
  });

  after(() => server.close());
});
