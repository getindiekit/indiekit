import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { Buffer } from "node:buffer";
import { url2Mf2 } from "./mf2.js";

const algorithm = "aes-256-ctr";
const secretKey = randomBytes(32);

/**
 * Encrypt a string
 *
 * @param {string} string String to encrypt
 * @param {string} iv Initialization vector
 * @returns {string} Encrypted hash
 */
export const encrypt = (string, iv) => {
  const cipher = createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(string), cipher.final()]);

  return encrypted.toString("hex");
};

/**
 * Decrypt a string
 *
 * @param {string} hash Hash to decrypt
 * @param {string} iv Initialization vector
 * @returns {string} Decrypted string
 */
export const decrypt = (hash, iv) => {
  const decipher = createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
};

/**
 * Canonicalise URL according to IndieAuth spec
 *
 * @param {string} url The URL to canonicalise
 * @returns {string} The canonicalised URL
 * @see {@link https://indieauth.spec.indieweb.org/#url-canonicalization}
 */
export const getCanonicalUrl = (url) => new URL(url).href;

/**
 *
 * @param {object} request HTTP request
 * @returns {string} Fully resolved URL
 */
export const getUrl = (request) => {
  return `${request.protocol}://${request.headers.host}`;
};

/**
 * Check if given string is a valid URL
 *
 * @param {object} string URL
 * @returns {boolean} String is a URL
 */
export const isUrl = (string) => {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }

  try {
    new URL(string); // eslint-disable-line no-new
    return true;
  } catch {
    return false;
  }
};

/**
 * Generate cryptographically random string
 *
 * @param {number} [length=21] Length of string
 * @returns {string} Random string
 */
export const randomString = (length = 21) =>
  randomBytes(length).toString("hex").slice(0, length);
