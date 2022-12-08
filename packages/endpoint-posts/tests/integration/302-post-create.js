import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

await mockAgent("store");

test("Creates post and redirects to posts page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/posts/new")
    .type("form")
    .set("cookie", [cookie()])
    .send({ content: "Foobar" })
    .send({ visibility: "_ignore" });

  t.is(result.status, 302);
  t.regex(result.text, /Found. Redirecting to \/posts\?success/);

  server.close(t);
});
