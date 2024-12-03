import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth/token", () => {
  it("Returns 400 error no `client_id`", async () => {
    const result = await request
      .post("/auth/token")
      .set("accept", "application/json")
      .query({ code: "code" })
      .query({ grant_type: "authorization_code" })
      .query({ redirect_uri: "/" });

    assert.equal(result.status, 400);
    assert.equal(
      result.body.error_description,
      "Missing parameter: `client_id`",
    );
  });

  after(() => server.close());
});
