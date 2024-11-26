import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { createPasswordHash, verifyPassword } from "../../lib/password.js";

describe("endpoint-auth/lib/client", () => {
  it("Creates password hash", async () => {
    process.env.SECRET = "test";
    assert.match(await createPasswordHash("foo"), /^\$2[aby]\$.{56}$/);
  });

  it("Verifies password", async () => {
    process.env.PASSWORD_SECRET = await createPasswordHash("foo");
    assert.equal(await verifyPassword("foo"), true);
    assert.equal(await verifyPassword("bar"), false);
  });
});
