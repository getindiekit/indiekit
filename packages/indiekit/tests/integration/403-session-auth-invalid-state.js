import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 403 error auth with invalid code/state", async (t) => {
  const request = await testServer();

  const result = await request
    .get("/session/auth")
    .query("redirect=%2Fstatus")
    .query("code=foo")
    .query("state=bar");

  t.is(result.status, 403);
  t.true(result.text.includes("Missing code or state mismatch"));
});
