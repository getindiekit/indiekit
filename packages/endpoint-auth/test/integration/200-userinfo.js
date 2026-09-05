import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

await mockAgent("endpoint-auth");
const server = await testServer({
  "@indiekit/endpoint-auth": {
    profile: { name: "Jane Doe" },
  },
});
const request = supertest.agent(server);

describe("endpoint-auth GET /auth/userinfo", () => {
  it("Returns profile information, configured values first", async () => {
    const result = await request
      .get("/auth/userinfo")
      .auth(testToken({ scope: "profile create" }), { type: "bearer" })
      .set("accept", "application/json");

    assert.equal(result.status, 200);
    assert.deepEqual(result.body, {
      name: "Jane Doe",
      url: "https://website.example",
      photo: "https://website.example/photo.jpg",
    });
  });

  after(() => server.close());
});
