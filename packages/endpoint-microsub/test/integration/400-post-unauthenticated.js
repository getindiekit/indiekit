import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
  plugins: ["@indiekit/endpoint-microsub"],
});
const request = supertest.agent(server);

describe("endpoint-microsub POST /microsub", () => {
  it("Rejects unauthenticated requests without a CSRF token", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .send({ action: "channels", name: "Tech News" });

    assert.equal(response.status, 400);
    assert.match(response.text, /InvalidRequestError/);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
