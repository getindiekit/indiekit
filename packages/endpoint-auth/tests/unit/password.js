import process from "node:process";
import test from "ava";
import { createPasswordHash, verifyPassword } from "../../lib/password.js";

test.beforeEach(() => {
  process.env.SECRET = "test";
});

test("Creates password hash", async (t) => {
  t.regex(await createPasswordHash("foo"), /^\$2[aby]\$.{56}$/);
});

test("Verifies password", async (t) => {
  process.env.PASSWORD_SECRET = await createPasswordHash("foo");
  t.true(await verifyPassword("foo"));
  t.false(await verifyPassword("bar"));
});
