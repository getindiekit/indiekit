import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { testToken } from "@indiekit-test/token";
import { JSDOM } from "jsdom";
import supertest from "supertest";

await mockAgent("endpoint-micropub");
const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
  plugins: [
    "@indiekit/syndicator-internet-archive",
    "@indiekit/syndicator-mastodon",
  ],
});
const request = supertest.agent(server);

describe("endpoint-share POST /share", () => {
  it("Sends each chosen syndication target to the Micropub endpoint", async () => {
    // Read the targets the form offers rather than assuming their uids
    const form = await request.get("/share").set("cookie", testCookie());
    const dom = new JSDOM(form.text);
    const targets = [
      ...dom.window.document.querySelectorAll('input[name="mp-syndicate-to"]'),
    ].map((input) => input.value);
    assert.equal(targets.length, 2);

    const result = await request
      .post("/share")
      .set("cookie", testCookie())
      .send(`access_token=${testToken()}`)
      .send("name=Foobar")
      .send("bookmark-of=https://example.website")
      .send(`mp-syndicate-to=${encodeURIComponent(targets[0])}`)
      .send(`mp-syndicate-to=${encodeURIComponent(targets[1])}`);

    assert.equal(result.status, 302);

    // The redirect carries Micropub's success message, which names the post URL
    const message = decodeURIComponent(
      new URL(
        result.headers.location,
        "https://share.example",
      ).searchParams.get("success") ?? "",
    );
    const url = message.match(/https?:\/\/\S+$/)?.[0];
    assert.ok(url, `no post URL in ${message}`);

    const post = await request
      .get("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "source" })
      .query({ url });

    // Both targets, as separate values, not one comma-joined string
    assert.deepEqual(post.body.properties["mp-syndicate-to"], targets);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
