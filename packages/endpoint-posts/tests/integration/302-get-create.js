import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

test("Redirects to posts page if no create permissions", async (t) => {
  const scopedCookie = testCookie({ scope: "update" });
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/posts/create")
    .set("cookie", [scopedCookie]);

  t.is(result.status, 302);
  t.regex(result.text, /Found. Redirecting to \/posts/);

  server.close(t);
});
