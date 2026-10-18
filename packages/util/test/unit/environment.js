import { strict as assert } from "node:assert";
import process from "node:process";
import { describe, it } from "node:test";

import { getSecret } from "../../lib/environment.js";

describe("util/lib/environment", () => {
  it("Gets secret from an environment variable", () => {
    process.env.TEST_SECRET = "secret";

    assert.equal(getSecret("TEST_SECRET"), "secret");
  });

  it("Throws error if environment variable not set", () => {
    delete process.env.TEST_SECRET;

    assert.throws(() => getSecret("TEST_SECRET"), {
      code: "not_implemented",
      message: "No secret. Set the `TEST_SECRET` environment variable.",
    });
  });

  it("Throws error if environment variable is empty", () => {
    process.env.TEST_SECRET = "";

    assert.throws(() => getSecret("TEST_SECRET"), {
      code: "not_implemented",
    });
  });
});
