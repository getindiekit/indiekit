import test from "ava";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Login redirects authenticated user to homepage", async (t) => {
  const request = await testServer();

  const result = await request.get("/session/login").set("cookie", [cookie]);

  t.is(result.headers.location, "/");
});
