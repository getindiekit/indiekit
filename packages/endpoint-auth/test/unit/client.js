import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";

import { getClientInformation } from "../../lib/client.js";

await mockAgent("endpoint-auth");

describe("endpoint-auth/lib/client", () => {
  it("Gets client information (from metadata)", async () => {
    const result = await getClientInformation(
      "https://auth-endpoint.example/id",
    );

    assert.deepEqual(result, {
      id: "https://auth-endpoint.example/id",
      logo: "https://auth-endpoint.example/logo.png",
      name: "Client with metadata",
      url: "https://auth-endpoint.example",
    });
  });

  it("Gets client information (has h-x-app microformat)", async () => {
    const result = await getClientInformation("https://auth-endpoint.example/");

    assert.deepEqual(result, {
      id: "https://auth-endpoint.example/",
      logo: "https://auth-endpoint.example/assets/icon.svg",
      name: "Example client",
      url: "https://auth-endpoint.example/",
    });
  });

  it("Gets client information (has h-app microformat, no URL)", async () => {
    const result = await getClientInformation("https://simple-client.example/");

    assert.deepEqual(result, {
      id: "https://simple-client.example/",
      name: "Simple client example",
      url: "https://simple-client.example/",
    });
  });

  it("Gets client information (no h-x-app microformat)", async () => {
    const result = await getClientInformation(
      "https://auth-endpoint.example/mf2",
    );

    assert.deepEqual(result, {
      id: "https://auth-endpoint.example/mf2",
      name: "auth-endpoint.example",
      url: "https://auth-endpoint.example/mf2",
    });
  });

  it("Gets client information (no microformats)", async () => {
    const result = await getClientInformation(
      "https://auth-endpoint.example/no-mf2",
    );

    assert.deepEqual(result, {
      id: "https://auth-endpoint.example/no-mf2",
      name: "auth-endpoint.example",
      url: "https://auth-endpoint.example/no-mf2",
    });
  });

  it("Returns client information (no response)", async () => {
    const result = await getClientInformation(
      "https://auth-endpoint.example/404",
    );

    assert.deepEqual(result, {
      id: "https://auth-endpoint.example/404",
      name: "auth-endpoint.example",
      url: "https://auth-endpoint.example/404",
    });
  });
});
