import crypto from "node:crypto";

/**
 * Verify PKCE (Proof Key for Code Exchange) code
 * @param {string} verifier - Code verifier
 * @param {string} challenge - Code challenge
 * @param {string} [challengeMethod] - Code challenge method
 * @returns {boolean} - Code challenge result
 */
export const verifyCode = (verifier, challenge, challengeMethod = "sha256") => {
  const base64Digest = crypto
    .createHash(challengeMethod)
    .update(verifier)
    .digest("base64url");

  return challenge === base64Digest.toString();
};
