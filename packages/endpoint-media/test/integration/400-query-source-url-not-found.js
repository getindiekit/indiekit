import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-media GET /media?q=source&url=*", () => {
  it("Returns 400 error source URL not found", async () => {
    const result = await request
      .get("/media")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "source" })
      .query({ url: "https://website.example/photo.jpg" });

    assert.equal(result.status, 400);
    assert.equal(
      result.body.error_description,
      "No file was found at this URL",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
