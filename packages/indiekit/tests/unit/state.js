import crypto from "node:crypto";
import test from "ava";
import { generateState, validateState } from "../../lib/state.js";

test.beforeEach((t) => {
  t.context = {
    clientId: "https://server.example",
    iv: crypto.randomBytes(16),
  };
});

test("Validates state", (t) => {
  const state = generateState(t.context.clientId, t.context.iv);
  const result = validateState(state, t.context.clientId, t.context.iv);

  t.is(String(result.date).slice(0, 10), String(Date.now()).slice(0, 10));
});

test("Invalidates state", (t) => {
  const result = validateState("state", t.context.clientId, t.context.iv);

  t.false(result);
});
