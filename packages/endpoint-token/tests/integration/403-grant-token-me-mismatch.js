import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("indieauth");

test("Returns 403 error granting token if URLs don’t match", async (t) => {
  const server = await testServer({
    publication: {
      me: "https://foo.bar",
    },
  });
  const request = supertest.agent(server);
  const result = await request
    .post("/token")
    .set("accept", "application/json")
    .query({ client_id: "https://client.example" })
    .query({ code: "123456" })
    .query({ redirect_uri: "/" });

  t.is(result.status, 403);
  t.is(
    result.body.error_description,
    "Publication URL does not match that provided by access token"
  );

  server.close(t);
});
