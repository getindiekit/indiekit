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

describe("endpoint-auth/lib/client fetchable origins", () => {
  it("Refuses to fetch an IP address", async () => {
    // A client identifier’s host name must be a domain name, and the mock
    // agent serves valid client markup at this address — so a returned name of
    // `169.254.169.254` shows no request was made
    const result = await getClientInformation("https://169.254.169.254/");

    assert.deepEqual(result, {
      id: "https://169.254.169.254/",
      name: "169.254.169.254",
      url: "https://169.254.169.254/",
    });
  });

  it("Refuses to fetch loopback, other IPs and non-HTTP schemes", async () => {
    // Net connections are disabled, so were any of these fetched the request
    // would throw rather than fall back to information derived from client_id
    for (const clientId of [
      "https://localhost:3000/",
      "https://127.0.0.1/",
      "https://[::1]/",
      "https://8.8.8.8/",
      "https://[2606:4700::1111]/",
      // Numeric encodings the system resolver accepts but `net.isIP` does not
      "https://2130706433/",
      "https://0x7f000001/",
      "https://0177.0.0.1/",
      "file:///etc/passwd",
    ]) {
      const result = await getClientInformation(clientId);

      assert.equal(result.id, clientId);
    }
  });

  it("Returns client information (body is not metadata or HTML)", async () => {
    // `mf2()` throws on an empty or non-HTML body; a client serving JSON must
    // not fail the whole authorization request
    const result = await getClientInformation(
      "https://auth-endpoint.example/json",
    );

    assert.equal(result.name, "auth-endpoint.example");
  });

  it("Returns client information (client unreachable)", async () => {
    const result = await getClientInformation("https://unreachable.example/");

    assert.deepEqual(result, {
      id: "https://unreachable.example/",
      name: "unreachable.example",
      url: "https://unreachable.example/",
    });
  });
});
