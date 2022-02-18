import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 400 if unsupported query provided", async (t) => {
  const request = await testServer();

  const result = await request
    .get("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("Accept", "application/json")
    .query("foo=bar");

  t.is(result.statusCode, 400);
  t.is(result.body.error_description, "Invalid query");
});
