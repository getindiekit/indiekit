import process from "node:process";
import test from "ava";
import nock from "nock";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 501 error as feature requires database", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar"))
    .twice()
    .reply(200);

  const server = await testServer({ useDatabase: false });
  const request = supertest.agent(server);
  await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send("name=foobar")
    .send("mp-syndicate-to=https://twitter.com/username");
  const result = await request
    .post("/syndicate")
    .set("accept", "application/json")
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/foobar/`)
    .query(`token=${process.env.TEST_TOKEN}`);

  t.is(result.status, 500);
  t.is(result.body.error_description, "This feature requires a database");

  server.close(t);
});
