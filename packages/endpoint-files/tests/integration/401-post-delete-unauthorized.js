import { Buffer } from "node:buffer";
import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

await mockAgent("endpoint-files");

test("Returns 401 error deleting file", async (t) => {
  const server = await testServer({
    application: {
      mediaEndpoint: "https://media-endpoint.example",
    },
  });
  const request = supertest.agent(server);
  const url = "https://website.example/401.jpg";
  const id = Buffer.from(url).toString("base64url");
  const result = await request
    .post(`/files/${id}/delete`)
    .set("cookie", [testCookie()])
    .send({ url });

  t.is(result.status, 401);

  server.close(t);
});
