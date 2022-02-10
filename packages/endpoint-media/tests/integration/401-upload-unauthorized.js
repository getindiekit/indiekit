import process from "node:process";
import test from "ava";
import nock from "nock";
import { testServer } from "@indiekit-test/server";

test("Returns 401 if access token does not provide adequate scope", async (t) => {
  nock("https://tokens.indieauth.com").get("/token").reply(200, {
    me: process.env.TEST_PUBLICATION_URL,
    scope: "update",
  });
  const request = await testServer();

  const result = await request
    .post("/media")
    .auth(process.env.TEST_BEARER_TOKEN_NOSCOPE, { type: "bearer" })
    .set("Accept", "application/json");

  t.is(result.statusCode, 401);
  t.is(
    result.body.error_description,
    "The scope of this token does not meet the requirements for this request"
  );
  t.is(result.body.scope, "create media");
});
