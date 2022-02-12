import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 400 if unsupported parameter provided", async (t) => {
  const request = await testServer();

  const result = await request
    .get("/media")
    .auth(process.env.TEST_BEARER_TOKEN, { type: "bearer" })
    .set("Accept", "application/json")
    .query("q=fooBar");

  t.is(result.statusCode, 400);
  t.is(result.body.error_description, "Unsupported parameter: fooBar");
});
