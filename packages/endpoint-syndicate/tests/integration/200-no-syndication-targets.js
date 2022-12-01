import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("store");

test("Returns no syndication targets configured", async (t) => {
  const server = await testServer({ useSyndicator: false });
  const request = supertest.agent(server);
  await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send("name=foobar")
    .send("mp-syndicate-to=https://twitter.com/username");
  const result = await request
    .post("/syndicate")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 200);
  t.is(
    result.body.success_description,
    "No syndication targets have been configured"
  );

  server.close(t);
});
