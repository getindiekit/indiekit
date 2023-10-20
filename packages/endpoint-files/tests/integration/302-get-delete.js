import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

await mockAgent("endpoint-files");

test("Redirects to file page if no delete permissions", async (t) => {
  const server = await testServer({
    application: { mediaEndpoint: "https://media-endpoint.example" },
  });
  const request = supertest.agent(server);
  const result = await request
    .get(`/files/123/delete`)
    .set("cookie", [testCookie({ scope: "media" })]);

  t.is(result.status, 302);
  t.regex(result.text, /Found. Redirecting to \/files\/(.*)/);

  server.close(t);
});
