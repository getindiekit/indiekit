import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /.well-known/change-password", () => {
  it("Returns 302 redirect from well known change password URL", async () => {
    const result = await request.get("/.well-known/change-password");

    assert.equal(result.status, 302);
    assert.equal(result.headers.location, "/auth/new-password");
  });

  after(() => server.close());
});
