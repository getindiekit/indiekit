import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns no post record for URL", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/syndicate")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/foobar/`);

  t.is(result.status, 200);
  t.is(
    result.body.success_description,
    `No post record available for ${process.env.TEST_PUBLICATION_URL}notes/foobar/`
  );

  server.close(t);
});
