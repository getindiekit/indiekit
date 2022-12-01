import process from "node:process";
import mockSession from "mock-session";
import { testToken } from "@indiekit-test/token";

export const cookie = mockSession("test", process.env.SECRET, {
  access_token: testToken(),
  scope: "create update delete media",
});
