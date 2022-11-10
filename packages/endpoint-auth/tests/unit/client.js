import test from "ava";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getClientInformation } from "../../lib/client.js";

await mockAgent("website");

test("Gets client information", async (t) => {
  const result = await getClientInformation("https://website.example");

  t.deepEqual(result, {
    logo: "https://website.example/assets/icon.svg",
    name: "Example website",
    url: "https://website.example",
  });
});

test("Returns default client information if no response", async (t) => {
  const result = await getClientInformation("https://website.example/404");

  t.deepEqual(result, {
    name: "website.example",
    url: "https://website.example/404",
  });
});
