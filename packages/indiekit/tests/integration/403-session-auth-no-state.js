import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 403 error auth with missing code/state", async (t) => {
  const request = await testServer();

  const result = await request.get("/session/auth").query("redirect=%2Fstatus");

  t.is(result.status, 403);
  t.true(result.text.includes("Missing code or state mismatch"));
});
