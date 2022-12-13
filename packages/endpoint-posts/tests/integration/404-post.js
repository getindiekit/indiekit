import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns 404 error post not found", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/posts/5ffcc8025c561a7bf53bd6e8")
    .auth(testToken(), { type: "bearer" });

  t.is(result.status, 404);
  t.true(
    result.text.includes(
      "If you entered a web address please check it was correct"
    )
  );

  server.close(t);
});
