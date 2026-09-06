import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

await mockAgent("endpoint-micropub");
const server = await testServer({
  plugins: ["@indiekit/post-type-page", "@indiekit/preset-eleventy"],
  usePostTypes: false,
});
const request = supertest.agent(server);

describe("endpoint-micropub POST /micropub", () => {
  it("Creates page at root URL", async () => {
    const result = await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send("h=page")
      .send("name=About")
      .send("content=All+about+me.");

    assert.equal(result.status, 202);
    assert.equal(result.headers.location, "https://website.example/about");
  });

  after(() => server.close());
});
