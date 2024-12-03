import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth/new-password", () => {
  it("Returns new password page with generated password secret", async () => {
    const response = await request
      .post("/auth/new-password")
      .type("form")
      .send({ password: "foo" });
    const dom = new JSDOM(response.text);
    const result = dom.window.document;

    assert.match(
      result.querySelector("#secret").textContent,
      /^\$2[aby]\$.{56}$/,
    );
  });

  after(() => server.close());
});
