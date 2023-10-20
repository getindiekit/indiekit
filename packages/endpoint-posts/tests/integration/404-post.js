import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns 404 error post not found", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/posts/404")
    .auth(testToken(), { type: "bearer" });

  t.is(result.status, 404);
  t.true(
    result.text.includes(
      "If you entered a web address please check it was correct",
    ),
  );

  server.close(t);
});
