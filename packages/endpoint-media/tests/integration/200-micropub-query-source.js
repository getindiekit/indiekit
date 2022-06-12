import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns list of previously uploaded files", async (t) => {
  const request = await testServer();

  const result = await request
    .get("/media")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .query("q=source");

  t.truthy(result.body.items);
});
