import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Logout redirects to homepage", async (t) => {
  const request = await testServer();

  const result = await request.get("/session/logout");

  t.is(result.header.location, "/");
  t.is(result.status, 302);
});
