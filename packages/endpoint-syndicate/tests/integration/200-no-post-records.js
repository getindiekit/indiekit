import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 200 if no post records", async (t) => {
  const request = await testServer();

  const result = await request
    .post("/syndicate")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 200);
  t.is(result.body.success_description, "No post records available");
});
