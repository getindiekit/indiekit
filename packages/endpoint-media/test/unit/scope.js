import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { hasScope } from "../../lib/scope.js";

describe("endpoint-media/lib/scope", () => {
  it("Action defaults to `media`", () => {
    assert.equal(hasScope("media"), true);
  });

  it("Scope defaults to `create`", () => {
    assert.equal(hasScope(undefined, "create"), true);
  });

  it("Returns true if action is permitted by scope", () => {
    assert.equal(hasScope("media", "media"), true);
    assert.equal(hasScope("create", "media"), true);
    assert.equal(hasScope("delete", "delete"), true);
  });

  it("Returns false if action not permitted by scope", () => {
    assert.equal(hasScope("create media", "delete"), false);
  });
});
