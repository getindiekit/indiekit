import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

import { signToken } from "../../lib/token.js";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth/token", () => {
  // Every code this server issues records the profile URL it authorizes, so
  // a code without one is not one this server issued.
  it("Returns error redeeming a code without a profile URL", async () => {
    const code = signToken({
      client_id: "https://client.example",
      redirect_uri: "https://client.example/redirect",
      scope: "create",
    });
    const result = await request
      .post("/auth/token")
      .set("accept", "application/json")
      .query({ client_id: "https://client.example" })
      .query({ code })
      .query({ grant_type: "authorization_code" })
      .query({ redirect_uri: "https://client.example/redirect" });

    assert.equal(result.status, 401);
    assert.equal(result.body.error, "unauthorized");
  });

  after(() => server.close());
});
