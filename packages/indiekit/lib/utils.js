import { Buffer } from "node:buffer";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const algorithm = "aes-256-ctr";
const secretKey = randomBytes(32);

/**
 * Encrypt a string
 * @param {string} string - String to encrypt
 * @param {string|NodeJS.ArrayBufferView} iv - Initialization vector
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
 * @param {string|NodeJS.ArrayBufferView} iv - Initialization vector
 * @returns {string} Decrypted string
 */
export const decrypt = (hash, iv) => {
  const decipher = createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, "hex"),
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
};

/**
 * Get serviceworker.js and update asset versions
 * @param {object} application - Application locals
 * @returns {Promise<string>} - serviceworker.js file
 */
export const getServiceWorker = async (application) => {
  try {
    const filePath = require.resolve("@indiekit/frontend/lib/serviceworker.js");
    let serviceworker = await readFile(filePath, { encoding: "utf8" });
    serviceworker = serviceworker
      .replace("APP_VERSION", application.package.version)
      .replace("APP_CSS_PATH", application.cssPath)
      .replace("APP_JS_PATH", application.jsPath);
    return serviceworker;
  } catch (error) {
    console.error(error.message);
  }
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
 * @param {string} filePath - File path
 * @returns {object} package.json
 */
export const getPackageData = (filePath) => {
  try {
    return require(path.join(filePath, "package.json"));
  } catch {
    return {};
  }
};
