import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Authentication callback returns 403 if redirect is invalid", async (t) => {
  const request = await testServer();

  const result = await request
    .get("/session/auth")
    .query("redirect=https://external.example");

  t.is(result.statusCode, 403);
  t.true(result.text.includes("Invalid redirect"));
});
