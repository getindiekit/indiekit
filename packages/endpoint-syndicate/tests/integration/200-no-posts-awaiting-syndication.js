import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("store");

test("Returns no post records awaiting syndication", async (t) => {
  const server = await testServer({
    plugins: ["@indiekit/syndicator-twitter"],
  });
  const request = supertest.agent(server);
  await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send("name=foobar");
  const result = await request
    .post("/syndicate")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 200);
  t.is(result.body.success_description, "No posts awaiting syndication");

  server.close(t);
});
