import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns list of previously published posts", async (t) => {
  const request = await testServer();

  const result = await request
    .get("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("Accept", "application/json")
    .query("q=source");

  t.truthy(result.body.items);
});
