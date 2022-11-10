import process from "node:process";
import test from "ava";
import { createPasswordHash, verifyPassword } from "../../lib/password.js";

test.beforeEach(() => {
  process.env.SECRET = "test";
});

test("Creates password hash", (t) => {
  t.is(createPasswordHash("foo"), "cdeb68b68f311608163d0d2f451ac96a");
});

test("Verifies password", (t) => {
  process.env.PASSWORD_SECRET = "cdeb68b68f311608163d0d2f451ac96a";
  t.true(verifyPassword("foo"));
  t.false(verifyPassword("bar"));
});
