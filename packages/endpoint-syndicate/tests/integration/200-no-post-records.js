import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns no post records", async (t) => {
  const server = await testServer({
    plugins: ["@indiekit/syndicator-mastodon"],
  });
  const request = supertest.agent(server);
  const result = await request
    .post("/syndicate")
    .query({ token: testToken() })
    .set("accept", "application/json");

  t.is(result.status, 200);
  t.is(result.body.success_description, "No posts awaiting syndication");

  server.close(t);
});
