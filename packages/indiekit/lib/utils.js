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
 * Get fully resolved server URL
 * @param {import("express").Request} request - Request
 * @returns {string} Fully resolved URL
 */
export const getUrl = (request) => {
  return `${request.protocol}://${request.headers.host}`;
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
