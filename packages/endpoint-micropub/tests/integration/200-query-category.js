import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns categories", async (t) => {
  const request = await testServer();

  const response = await request
    .get("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("Accept", "application/json")
    .query("q=category");

  t.truthy(response.body.categories);
});
