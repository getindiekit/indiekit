import { strict as assert } from "node:assert";
import { Buffer } from "node:buffer";
import { describe, it } from "node:test";
import { mockAgent } from "@indiekit-test/mock-agent";
import { Adapter } from "../../lib/adapter.js";

await mockAgent("endpoint-image");

describe("endpoint-image/lib/adapter", () => {
  const adapter = new Adapter({ prefixUrl: "https://website.example" });

  it("Express sharp adapter returns a Buffer", async () => {
    const result = await adapter.fetch("photo.jpg");
    assert.equal(result instanceof Buffer, true);
  });

  it("Express sharp adapter returns undefined if not found", async () => {
    const result = await adapter.fetch("404.jpg");
    assert.equal(result, undefined);
  });

  it("Express sharp adapter returns undefined if error", async () => {
    const result = await adapter.fetch("foo");
    assert.equal(result, undefined);
  });
});
