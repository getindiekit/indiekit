import { Buffer } from "node:buffer";
import test from "ava";
import { mockAgent } from "@indiekit-test/mock-agent";
import { Adapter } from "../../lib/adapter.js";

await mockAgent("endpoint-image");

test.beforeEach((t) => {
  t.context.adapter = new Adapter({ prefixUrl: "https://website.example" });
});

test("Express sharp adapter returns a Buffer", async (t) => {
  const result = await t.context.adapter.fetch("photo.jpg");
  t.true(result instanceof Buffer);
});

test("Express sharp adapter returns undefined if not found", async (t) => {
  const result = await t.context.adapter.fetch("404.jpg");
  t.is(result, undefined);
});

test("Express sharp adapter returns undefined if error", async (t) => {
  const result = await t.context.adapter.fetch("foo");
  t.is(result, undefined);
});
