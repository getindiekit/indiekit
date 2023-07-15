import test from "ava";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getClientInformation } from "../../lib/client.js";

await mockAgent("endpoint-auth");

test("Gets client information (with h-x-app microformat)", async (t) => {
  const result = await getClientInformation("https://auth-endpoint.example/");

  t.deepEqual(result, {
    logo: "https://auth-endpoint.example/assets/icon.svg",
    name: "Example client",
    url: "https://auth-endpoint.example/",
  });
});

test("Gets client information (without h-x-app microformat)", async (t) => {
  const result = await getClientInformation(
    "https://auth-endpoint.example/mf2"
  );

  t.deepEqual(result, {
    name: "auth-endpoint.example",
    url: "https://auth-endpoint.example/mf2",
  });
});

test("Gets client information (without microformats)", async (t) => {
  const result = await getClientInformation(
    "https://auth-endpoint.example/no-mf2"
  );

  t.deepEqual(result, {
    name: "auth-endpoint.example",
    url: "https://auth-endpoint.example/no-mf2",
  });
});

test("Returns client information (no response)", async (t) => {
  const result = await getClientInformation(
    "https://auth-endpoint.example/404"
  );

  t.deepEqual(result, {
    name: "auth-endpoint.example",
    url: "https://auth-endpoint.example/404",
  });
});
