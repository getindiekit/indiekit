import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

await mockAgent("endpoint-micropub");

test("Creates post and redirects to posts page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/posts/create")
    .type("form")
    .set("cookie", [testCookie()])
    .send({ type: "entry" })
    .send({ content: "Foobar" });

  t.is(result.status, 302);
  t.regex(result.text, /Found. Redirecting to \/posts\?success/);

  server.close(t);
});
