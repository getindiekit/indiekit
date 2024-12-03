import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-files GET /files/upload", () => {
  it("Redirects to files page if no upload permissions", async () => {
    const result = await request
      .get("/files/upload")
      .set("cookie", testCookie({ scope: "update" }));

    assert.equal(result.status, 302);
    assert.match(result.text, /Found. Redirecting to \/files/);
  });

  after(() => server.close());
});
