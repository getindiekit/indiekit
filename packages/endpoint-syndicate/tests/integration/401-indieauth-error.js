import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";
import { testToken } from "@indiekit-test/token";

test("Returns 401 error from Micropub endpoint", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .set("cookie", [cookie])
    .send("h=entry")
    .send("name=foobar")
    .send("mp-syndicate-to=https://twitter.com/username");
  const result = await request
    .post("/syndicate")
    .set("accept", "application/json")
    .query({ url: "https://website.example/notes/foobar/" })
    .query({ token: "foo.bar.baz" });

  t.is(result.status, 401);
  t.is(
    result.body.error_description,
    "The access token provided is expired, revoked, malformed, or invalid for other reasons"
  );

  server.close(t);
});
