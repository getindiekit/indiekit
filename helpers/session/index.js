import { getSecret } from "@indiekit/util";
import { testToken } from "@indiekit-test/token";
import mockSession from "mock-session";

/**
 * Get session cookie for testing
 * @param {Parameters<typeof testToken>[0]} [options] - Access token options
 * @returns {string} Session cookie
 */
export const testCookie = (options) => {
  return mockSession("Test configuration", getSecret("SECRET"), {
    access_token: testToken(options),
    scope: options?.scope || "create update delete media",
  });
};
