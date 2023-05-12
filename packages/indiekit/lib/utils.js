import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { Buffer } from "node:buffer";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const algorithm = "aes-256-ctr";
const secretKey = randomBytes(32);

/**
 * Encrypt a string
 * @param {string} string - String to encrypt
 * @param {string} iv - Initialization vector
 * @returns {string} Encrypted hash
 */
export const encrypt = (string, iv) => {
  const cipher = createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(string), cipher.final()]);

  return encrypted.toString("hex");
};

/**
 * Decrypt a string
 * @param {string} hash - Hash to decrypt
 * @param {string} iv - Initialization vector
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
 * @param {string} url - The URL to canonicalise
 * @returns {string} The canonicalised URL
 * @see {@link https://indieauth.spec.indieweb.org/#url-canonicalization}
 */
export const getCanonicalUrl = (url) => new URL(url).href;

/**
 * Get fully resolved server URL
 * @param {object} request - HTTP request
 * @returns {string} Fully resolved URL
 */
export const getUrl = (request) => {
  return `${request.protocol}://${request.headers.host}`;
};

/**
 * Check if given string is a valid URL
 * @param {object} string - URL
 * @returns {boolean} String is a URL
 */
export const isUrl = (string) => {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }

  try {
    new URL(decodeURIComponent(string)); // eslint-disable-line no-new
    return true;
  } catch {
    return false;
  }
};

/**
 * Get package JSON object
 * @param {string} fileUrl - File URL
 * @returns {object} package.json
 */
export const getPackageData = (fileUrl) => {
  try {
    const filePath = fileURLToPath(fileUrl);
    const packageDirectory = path.dirname(filePath);
    return require(path.join(packageDirectory, "package.json"));
  } catch {
    return {};
  }
};

/**
 * Generate cryptographically random string
 * @param {number} [length=21] - Length of string
 * @returns {string} Random string
 */
export const randomString = (length = 21) =>
  randomBytes(length).toString("hex").slice(0, length);
