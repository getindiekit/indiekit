import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns 400 deleting post without a URL", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/micropub")
    .accept("application/json")
    .auth(testToken(), { type: "bearer" })
    .send({
      action: "delete",
    });

  t.is(result.status, 400);
  t.is(result.body.error_description, "Missing parameter: `url`");

  server.close(t);
});
