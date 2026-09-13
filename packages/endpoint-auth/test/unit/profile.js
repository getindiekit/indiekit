import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";

import { getProfileInformation } from "../../lib/profile.js";

await mockAgent("endpoint-auth");

describe("endpoint-auth/lib/profile", () => {
  it("Discovers profile from h-card on user’s site", async () => {
    const result = await getProfileInformation("https://website.example");

    assert.deepEqual(result, {
      name: "Jane Example",
      url: "https://website.example",
      photo: "https://website.example/photo.jpg",
    });
  });

  it("Prefers configured values, discovering the rest", async () => {
    const result = await getProfileInformation("https://website.example", {
      name: "Jane Doe",
    });

    assert.equal(result.name, "Jane Doe");
    assert.equal(result.photo, "https://website.example/photo.jpg");
  });

  it("Returns configured values if user’s site can’t be fetched", async () => {
    const result = await getProfileInformation("https://profile-404.example", {
      name: "Jane Doe",
    });

    assert.deepEqual(result, { name: "Jane Doe" });
  });

  it("Returns undefined if no h-card and nothing configured", async () => {
    const result = await getProfileInformation("https://no-hcard.example");

    assert.equal(result, undefined);
  });

  it("Doesn’t fetch an address that isn’t a domain name", async () => {
    const result = await getProfileInformation("http://127.0.0.1/");

    assert.equal(result, undefined);
  });
});
