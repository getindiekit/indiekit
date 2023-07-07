import { decrypt, encrypt } from "./utils.js";

/**
 * Generate unique encrypted state value
 * @param {string} clientId - Client ID
 * @param {object} iv - Initialization vector
 * @returns {string} State
 */
export const generateState = (clientId, iv) => {
  const state = encrypt(
    JSON.stringify({
      clientId,
      date: Date.now(),
    }),
    iv
  );

  return state;
};

/**
 * Validate state generated using `generateState` method
 * @param {object} state - State
 * @param {string} clientId - Client ID
 * @param {object} iv - Initialization vector
 * @returns {object|boolean|undefined} Validated state object, returns false on failure
 */
export const validateState = (state, clientId, iv) => {
  try {
    state = JSON.parse(decrypt(state, iv));
    const validClient = state.clientId === clientId;
    const validDate = state.date > Date.now() - 1000 * 60 * 10;

    if (validClient && validDate) {
      return state;
    }
  } catch {
    return false;
  }
};
