import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns 404 error file not found performing action", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/media")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .send({
      action: "delete",
      url: "https://website.example/foo.jpg",
    });

  t.is(result.status, 404);
  t.is(
    result.body.error_description,
    "No database record found for https://website.example/foo.jpg",
  );

  server.close(t);
});
