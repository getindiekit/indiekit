import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth/token", () => {
  it("Returns 400 error no `redirect_uri`", async () => {
    const result = await request
      .post("/auth/token")
      .set("accept", "application/json")
      .query({ client_id: "https://server.example" })
      .query({ code: "code" })
      .query({ grant_type: "authorization_code" });

    assert.equal(result.status, 400);
    assert.equal(
      result.body.error_description,
      "Missing parameter: `redirect_uri`",
    );
  });

  after(() => server.close());
});
