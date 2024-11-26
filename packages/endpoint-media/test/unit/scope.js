import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { checkScope } from "../../lib/scope.js";

describe("endpoint-media/lib/scope", () => {
  it("Action defaults to `media`", () => {
    assert.equal(checkScope("media"), true);
  });

  it("Scope defaults to `create`", () => {
    assert.equal(checkScope(undefined, "create"), true);
  });

  it("Returns true if action is permitted by scope", () => {
    assert.equal(checkScope("media", "media"), true);
    assert.equal(checkScope("create", "media"), true);
    assert.equal(checkScope("delete", "delete"), true);
  });

  it("Returns false if action not permitted by scope", () => {
    assert.equal(checkScope("create media", "delete"), false);
  });
});
