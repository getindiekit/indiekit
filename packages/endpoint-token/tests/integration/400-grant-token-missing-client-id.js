import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 400 if missing client_id value", async (t) => {
  const request = await testServer();
  const result = await request
    .post("/token")
    .set("Accept", "application/json")
    .query({ code: "foo" })
    .query({ redirect_uri: "/" });

  t.is(result.status, 400);
  t.is(result.body.error_description, "Missing client ID");
});
