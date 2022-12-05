import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Returns 404 error deleting post with no record", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post(`/posts/foobar/delete`)
    .set("cookie", [cookie()]);

  t.is(result.status, 404);
  t.true(result.text.includes("No post was found at this URL"));

  server.close(t);
});
