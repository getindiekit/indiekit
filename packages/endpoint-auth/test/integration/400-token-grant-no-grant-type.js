import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth/token", () => {
  // The authorization endpoint accepts a code exchange without `grant_type`,
  // for clients predating the specification that introduced it. That allowance
  // is deliberately limited to the profile exchange: issuing an access token
  // still requires the parameter.
  it("Returns 400 error no `grant_type`", async () => {
    const result = await request
      .post("/auth/token")
      .set("accept", "application/json")
      .query({ client_id: "https://server.example" })
      .query({ code: "code" })
      .query({ redirect_uri: "/" });

    assert.equal(result.status, 400);
    assert.equal(
      result.body.error_description,
      "Missing parameter: `grant_type`",
    );
  });

  after(() => server.close());
});
