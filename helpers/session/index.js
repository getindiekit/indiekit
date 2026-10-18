import { getSecret } from "@indiekit/util";
import { testToken } from "@indiekit-test/token";
import mockSession from "mock-session";

export const testCookie = (options) => {
  return mockSession("Test configuration", getSecret("SECRET"), {
    access_token: testToken(options),
    scope: options?.scope || "create update delete media",
  });
};
