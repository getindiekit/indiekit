import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { checkScope } from "../../lib/scope.js";

describe("endpoint-media/lib/scope", () => {
  it("Action defaults to `create`", () => {
    assert.equal(checkScope("create update"), true);
  });

  it("Scope defaults to `create`", () => {
    assert.equal(checkScope(undefined, "create"), true);
  });

  it("Returns true if action is permitted by scope", () => {
    assert.equal(checkScope("create update", "update"), true);
  });

  it("Returns true if `create` action but scope is `post`", () => {
    assert.equal(checkScope("post", "create"), true);
  });

  it("Returns true if `create` action but scope includes `post`", () => {
    assert.equal(checkScope("post delete", "create"), true);
  });

  it("Returns true if `undelete` action but scope is `create`", () => {
    assert.equal(checkScope("create", "undelete"), true);
  });

  it("Returns `draft` if `create` action but scope includes `draft`", () => {
    assert.equal(checkScope("create draft update", "create"), "draft");
  });

  it("Returns `draft` if `undelete` action but scope is `draft`", () => {
    assert.equal(checkScope("draft", "undelete"), "draft");
  });

  it("Returns false if action not permitted by scope", () => {
    assert.equal(checkScope("create update", "delete"), false);
  });
});
