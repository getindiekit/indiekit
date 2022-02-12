import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 401 if access token does not provide adequate scope", async (t) => {
  const request = await testServer();

  const result = await request
    .post("/micropub")
    .auth(process.env.TEST_BEARER_TOKEN_NOSCOPE, { type: "bearer" })
    .set("Accept", "application/json");

  t.is(result.statusCode, 401);
  t.is(
    result.body.error_description,
    "JSON Web Token error: invalid signature"
  );
});
