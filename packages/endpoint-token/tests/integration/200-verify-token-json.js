import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Verifies token and returns JSON", async (t) => {
  const request = await testServer();
  const result = await request
    .get("/token")
    .auth(process.env.TEST_BEARER_TOKEN, { type: "bearer" })
    .set("Accept", "application/json");

  t.is(result.status, 200);
  t.truthy(result.body.client_id);
  t.is(result.body.me, process.env.TEST_PUBLICATION_URL);
  t.truthy(result.body.scope);
});
