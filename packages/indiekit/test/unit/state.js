import { strict as assert } from "node:assert";
import crypto from "node:crypto";
import { describe, it } from "node:test";
import { generateState, validateState } from "../../lib/state.js";

const clientId = "https://server.example";
const iv = crypto.randomBytes(16);

describe("indiekit/lib/state", () => {
  it("Validates state", () => {
    const state = generateState(clientId, iv);
    const result = validateState(state, clientId, iv);

    assert.equal(
      String(result.date).slice(0, 10),
      String(Date.now()).slice(0, 10),
    );
  });

  it("Invalidates state", () => {
    const result = validateState("state", clientId, iv);

    assert.equal(result, false);
  });
});
