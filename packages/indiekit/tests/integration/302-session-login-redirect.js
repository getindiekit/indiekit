import process from "node:process";
import mockSession from "mock-session";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Login redirects authenticated user to homepage", async (t) => {
  const request = await testServer();

  const cookie = mockSession("test", process.env.TEST_SESSION_SECRET, {
    token: process.env.TEST_BEARER_TOKEN,
  });
  const result = await request.get("/session/login").set("Cookie", [cookie]);

  t.is(result.headers.location, "/");
});
