import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { after, before, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import jwt from "jsonwebtoken";
import supertest from "supertest";

await mockAgent("endpoint-syndicate");
const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
  plugins: ["@indiekit/syndicator-mastodon"],
});
const request = supertest.agent(server);

describe("endpoint-syndicate POST /syndicate", () => {
  before(async () => {
    process.env.SECRET = "secret";
    process.env.WEBHOOK_SECRET = "webhook-secret";

    await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send("h=entry")
      .send("name=foobar")
      .send("mp-syndicate-to=https://mastodon.example/@username");
  });

  it("Syndicates recent post (via Netlify webhook)", async () => {
    const sha256 = createHash("sha256").update("foo").digest("hex");
    const result = await request
      .post("/syndicate")
      .set("accept", "application/json")
      .set(
        "x-webhook-signature",
        jwt.sign({ iss: "netlify", sha256 }, process.env.WEBHOOK_SECRET),
      )
      .send({ url: "https://website.example" });

    assert.equal(result.status, 200);
    assert.equal(
      result.body.success_description,
      "Post updated at https://website.example/notes/foobar/",
    );
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
