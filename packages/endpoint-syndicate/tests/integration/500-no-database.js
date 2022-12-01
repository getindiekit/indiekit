import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns 501 error as feature requires database", async (t) => {
  const server = await testServer({ useDatabase: false });
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
    .set("accept", "application/json")
    .query("url=https://website.example/notes/foobar/")
    .query(`token=${testToken()}`);

  t.is(result.status, 501);
  t.is(result.body.error_description, "This feature requires a database");

  server.close(t);
});
