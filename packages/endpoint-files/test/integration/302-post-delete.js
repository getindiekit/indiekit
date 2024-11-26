import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import supertest from "supertest";

await mockAgent("endpoint-files");
const server = await testServer({
  application: { mediaEndpoint: "https://media-endpoint.example" },
});
const request = supertest.agent(server);

describe("endpoint-files POST /files/:uid/delete", () => {
  it("Deletes file and redirects to files page", async () => {
    const result = await request
      .post(`/files/123/delete`)
      .set("cookie", testCookie())
      .send({ url: "https://website.example/photo.jpg" });

    assert.equal(result.status, 302);
    assert.match(result.text, /Found. Redirecting to \/files\?success/);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
