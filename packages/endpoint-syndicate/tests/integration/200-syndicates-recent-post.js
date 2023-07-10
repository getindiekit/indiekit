import { createHash } from "node:crypto";
import process from "node:process";
import test from "ava";
import nock from "nock";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-syndicate");

test.beforeEach(() => {
  process.env.SECRET = "secret";
  process.env.WEBHOOK_SECRET = "webhook-secret";
});

test("Syndicates recent post (via Netlify webhook)", async (t) => {
  nock("https://mastodon.example").post("/api/v1/statuses").reply(200, {
    url: "https://mastodon.example/@username/1234567890987654321",
  });

  const sha256 = createHash("sha256").update("foo").digest("hex");
  const webhookSignature = jwt.sign(
    { iss: "netlify", sha256 },
    process.env.WEBHOOK_SECRET
  );

  const server = await testServer({
    plugins: ["@indiekit/syndicator-mastodon"],
  });
  const request = supertest.agent(server);
  await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send("name=foobar")
    .send("mp-syndicate-to=https://mastodon.example/@username");
  const result = await request
    .post("/syndicate")
    .set("accept", "application/json")
    .set("x-webhook-signature", webhookSignature)
    .send({ url: "https://website.example" });

  t.is(result.status, 200);
  t.is(
    result.body.success_description,
    "Post updated at https://website.example/notes/foobar/"
  );

  server.close(t);
});
