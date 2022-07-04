import process from "node:process";
import mockSession from "mock-session";

export const cookie = mockSession("test", process.env.TEST_SESSION_SECRET, {
  access_token: process.env.TEST_TOKEN,
  scope: "create update delete media",
});
