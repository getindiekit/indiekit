import test from "ava";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getClientInformation } from "../../lib/client.js";

await mockAgent("endpoint-auth");

test("Gets client information", async (t) => {
  const result = await getClientInformation("https://auth-endpoint.example");

  t.deepEqual(result, {
    logo: "https://auth-endpoint.example/assets/icon.svg",
    name: "Example website",
    url: "https://auth-endpoint.example",
  });
});

test("Returns default client information if no response", async (t) => {
  const result = await getClientInformation(
    "https://auth-endpoint.example/404"
  );

  t.deepEqual(result, {
    name: "auth-endpoint.example",
    url: "https://auth-endpoint.example/404",
  });
});
