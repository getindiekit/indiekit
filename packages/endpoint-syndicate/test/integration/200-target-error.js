import { strict as assert } from "node:assert";
import { after, before, describe, it, mock } from "node:test";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-syndicate");
const server = await testServer({
  plugins: ["@indiekit/syndicator-internet-archive"],
});
const request = supertest.agent(server);

describe("endpoint-syndicate POST /syndicate", () => {
  before(async () => {
    await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send("h=entry")
      .send("name=foobar")
      .send("mp-syndicate-to=https://web.archive.org/");
  });

  it("Returns information about unsuccessfully syndicated URL", async () => {
    mock.method(console, "error", () => {});

    const result = await request
      .post("/syndicate")
      .set("accept", "application/json")
      .query({ source_url: "https://website.example/notes/foobar/" })
      .query({ token: testToken() });

    assert.equal(result.status, 200);
    assert.equal(
      result.body.success_description,
      "Post at https://website.example/notes/foobar/ not updated as no properties changed. The following target(s) did not return a URL: https://web.archive.org/",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
