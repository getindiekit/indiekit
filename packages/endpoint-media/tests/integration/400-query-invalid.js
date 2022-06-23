import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 400 error query parameter not provided", async (t) => {
  const request = await testServer();

  const result = await request
    .get("/media")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .query("foo=bar");

  t.is(result.status, 400);
  t.is(result.body.error_description, "Missing parameter: `q`");
});
