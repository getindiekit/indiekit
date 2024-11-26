import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth", () => {
  it("Returns documentation with invalid `client_id` error", async () => {
    const result = await request
      .get("/auth")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ redirect_uri: "https://another.example/redirect" })
      .query({ response_type: "code" })
      .query({ state: "12345" });

    assert.equal(result.status, 200);
    assert.equal(
      result.text.includes(
        "Invalid value provided for: <code>redirect_uri</code>",
      ),
      true,
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
