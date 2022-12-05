import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Redirects to files page if no upload permissions", async (t) => {
  const scopedCookie = cookie({ scope: "update" });
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/files/new").set("cookie", [scopedCookie]);

  t.is(result.status, 302);

  server.close(t);
});
