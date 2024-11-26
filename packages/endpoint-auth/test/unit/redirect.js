import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { validateRedirect } from "../../lib/redirect.js";

describe("endpoint-auth/lib/redirect", () => {
  it("Validates `redirect_uri`", () => {
    assert.equal(
      validateRedirect(
        "https://client.example:3000",
        "https://client.example:3000/redirect",
      ),
      true,
    );
    assert.equal(
      validateRedirect(
        "https://client.example:3000",
        "https://client.example:8080/redirect",
      ),
      false,
    );
    assert.equal(
      validateRedirect(
        "https://client.example",
        "https://www.client.example/redirect",
      ),
      false,
    );
  });
});
