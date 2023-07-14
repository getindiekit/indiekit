import { Buffer } from "node:buffer";
import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

await mockAgent("endpoint-files");

test("Deletes file and redirects to files page", async (t) => {
  const server = await testServer({
    application: { mediaEndpoint: "https://media-endpoint.example" },
  });
  const request = supertest.agent(server);
  const url = "https://website.example/photo.jpg";
  const id = Buffer.from(url).toString("base64url");
  const result = await request
    .post(`/files/${id}/delete`)
    .set("cookie", [testCookie()])
    .send({ url });

  t.is(result.status, 302);
  t.regex(result.text, /Found. Redirecting to \/files\?success/);

  server.close(t);
});
