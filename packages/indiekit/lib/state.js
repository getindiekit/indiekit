import { decrypt, encrypt } from "./utils.js";

/**
 * Generate unique encrypted state value
 * @param {string} clientId - Client ID
 * @param {Buffer} iv - Initialization vector
 * @returns {string} State
 */
export const generateState = (clientId, iv) => {
  const state = encrypt(
    JSON.stringify({
      clientId,
      date: Date.now(),
    }),
    iv,
  );

  return state;
};

/**
 * State, as generated using `generateState` method
 * @typedef {object} State
 * @property {string} clientId - Client ID
 * @property {number} date - Time generated, in milliseconds
 */

/**
 * Validate state generated using `generateState` method
 * @param {string} state - State
 * @param {string} clientId - Client ID
 * @param {Buffer} iv - Initialization vector
 * @returns {State|false|undefined} Validated state object, returns false on failure
 */
export const validateState = (state, clientId, iv) => {
  try {
    /**
     * @type {State}
     */
    const decryptedState = JSON.parse(decrypt(state, iv));
    const isValidClient = decryptedState.clientId === clientId;
    const isValidDate = decryptedState.date > Date.now() - 1000 * 60 * 10;

    if (isValidClient && isValidDate) {
      return decryptedState;
    }
  } catch {
    return false;
  }
};

/**
 * @import { Buffer } from "node:buffer"
 */
