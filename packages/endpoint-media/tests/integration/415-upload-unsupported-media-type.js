import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";

test("Returns 415 error unsupported media type", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/media")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .attach("file", getFixture("file-types/font.ttf", false), "font.ttf");

  t.is(result.status, 415);
  t.is(result.body.error_description, "The font media type is not supported");

  server.close(t);
});
