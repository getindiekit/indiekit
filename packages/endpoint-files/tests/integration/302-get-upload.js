import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

test("Redirects to files page if no upload permissions", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/files/upload")
    .set("cookie", [testCookie({ scope: "update" })]);

  t.is(result.status, 302);
  t.regex(result.text, /Found. Redirecting to \/files/);

  server.close(t);
});
