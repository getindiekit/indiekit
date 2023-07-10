import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("endpoint-auth");

test("Returns 422 error missing password", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const authResponse = await request
    .get("/auth")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
    .query({ response_type: "code" })
    .query({ state: "12345" });
  const reference = authResponse.headers.location.slice(-16);
  const response = await request
    .post("/auth/consent")
    .type("form")
    .query({ request_uri: `urn:ietf:params:oauth:request_uri:${reference}` })
    .send({ scope: ["create"] });
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.is(response.status, 422);
  t.is(
    result.querySelector("title").textContent,
    "Error: Authorize application - Test configuration"
  );
  t.is(
    result.querySelector("#password-error .error-message__text").textContent,
    "Enter a password"
  );

  server.close(t);
});
