import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 400 error auth with missing state", async (t) => {
  const request = await testServer();

  const result = await request
    .get("/session/auth")
    .query("redirect=%2Fstatus&code=code");

  t.is(result.status, 400);
  t.true(result.text.includes("Missing parameter: <code>state</code>"));
});
