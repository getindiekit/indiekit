import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-files GET /files/:uid", () => {
  it("Returns 404 error file not found", async () => {
    const result = await request.get("/files/404").set("cookie", testCookie());

    assert.equal(result.status, 404);
    assert.equal(
      result.text.includes(
        "If you entered a web address please check it was correct",
      ),
      true,
    );
  });

  after(() => server.close());
});
