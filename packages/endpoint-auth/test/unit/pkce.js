import { strict as assert } from "node:assert";
import { createHash, randomBytes } from "node:crypto";
import { describe, it } from "node:test";

import { isVerifiedCode } from "../../lib/pkce.js";

describe("endpoint-auth/lib/pkce", () => {
  it("Verifies PKCE (Proof Key for Code Exchange) code", () => {
    const verifier = randomBytes(21).toString("hex").slice(0, 21);
    const challenge = createHash("sha256").update(verifier).digest("base64url");

    assert.equal(isVerifiedCode(verifier, challenge), true);
    assert.equal(isVerifiedCode(verifier, "challenge"), false);
  });
});
