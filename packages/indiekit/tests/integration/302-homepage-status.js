import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Homepage redirects to status page", async (t) => {
  const request = await testServer();

  const result = await request.get("/");

  t.is(result.header.location, "/status");
  t.is(result.statusCode, 302);
});
