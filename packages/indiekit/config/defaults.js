import crypto from "node:crypto";
import { createRequire } from "node:module";
import process from "node:process";
import cookieSession from "cookie-session";
// eslint-ignore import/order
const require = createRequire(import.meta.url);
const package_ = require("../package.json");

export const defaultConfig = {
  application: {
    _devMode: false,
    endpoints: [],
    hasDatabase: false,
    localesAvailable: [
      "de",
      "en",
      "es",
      "fr",
      "id",
      "nl",
      "pl",
      "pt",
      "sr",
      "zh-Hans-CN",
    ],
    mongodbUrl: process.env.MONGO_URL || false,
    name: "Indiekit",
    port: process.env.PORT || "3000",
    repository: package_.repository,
    themeColor: "#04f",
    themeColorScheme: "automatic",
    timeZone: "UTC",
    ttl: 604_800, // 7 days
    version: package_.version,
  },
  plugins: [
    "@indiekit/endpoint-auth",
    "@indiekit/endpoint-files",
    "@indiekit/endpoint-image",
    "@indiekit/endpoint-media",
    "@indiekit/endpoint-micropub",
    "@indiekit/endpoint-posts",
    "@indiekit/endpoint-share",
    "@indiekit/endpoint-syndicate",
  ],
  publication: {
    categories: [],
    locale: "en",
    me: undefined,
    postTemplate: undefined,
    postTypes: [],
    preset: undefined,
    slugSeparator: "-",
    storeMessageTemplate: (metaData) =>
      `${metaData.action} ${metaData.postType} ${metaData.fileType}`,
    syndicationTargets: [],
  },
};

defaultConfig.application.sessionMiddleware = cookieSession({
  name: defaultConfig.application.name,
  secret: crypto.randomBytes(16).toString(),
});
