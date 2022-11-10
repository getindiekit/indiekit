import { createHash, randomBytes } from "node:crypto";
import test from "ava";
import { verifyCode } from "../../lib/pkce.js";

test("Verifies PKCE (Proof Key for Code Exchange) code", (t) => {
  const verifier = randomBytes(21).toString("hex").slice(0, 21);
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  t.true(verifyCode(verifier, challenge));
  t.false(verifyCode(verifier, "challenge"));
});
