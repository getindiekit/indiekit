import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { setGlobalDispatcher } from "undici";
import { storeAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(storeAgent());

test("Returns 400 updating post without operation to perform", async (t) => {
  // Create post
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .send({
      type: ["h-entry"],
      properties: {
        name: ["Foobar"],
      },
    });

  // Update post
  const result = await request
    .post("/micropub")
    .accept("application/json")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .send({
      action: "update",
      url: response.header.location,
    });

  t.is(result.status, 400);
  t.is(
    result.body.error_description,
    "No replace, add or remove operations included in request"
  );

  server.close(t);
});
