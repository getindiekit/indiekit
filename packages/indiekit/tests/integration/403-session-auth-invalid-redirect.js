import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 403 error auth with invalid redirect", async (t) => {
  const request = await testServer();

  const result = await request
    .get("/session/auth")
    .query("redirect=https://external.example");

  t.is(result.status, 403);
  t.true(result.text.includes("Invalid redirect attempted"));
});
