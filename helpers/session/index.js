import process from "node:process";
import mockSession from "mock-session";
import { testToken } from "@indiekit-test/token";

export const testCookie = (options) => {
  return mockSession("test", process.env.SECRET, {
    access_token: testToken(options),
    scope: options?.scope || "create update delete media",
  });
};
