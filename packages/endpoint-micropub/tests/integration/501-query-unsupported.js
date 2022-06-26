import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 501 error unsupported parameter provided", async (t) => {
  const request = await testServer();

  const result = await request
    .get("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .query("q=fooBar");

  t.is(result.status, 501);
  t.is(result.body.error_description, "Unsupported query for `q`: `fooBar`");
});
