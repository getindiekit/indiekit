import crypto from "node:crypto";
import { createRequire } from "node:module";
import process from "node:process";
import cookieSession from "cookie-session";

const require = createRequire(import.meta.url);
const package_ = require("../package.json");

export const defaultConfig = {
  application: {
    _devMode: false,
    endpoints: [],
    hasDatabase: false,
    localesAvailable: ["de", "en", "es", "fr", "id", "nl", "pl", "pt", "sr"],
    mongodbUrl: false,
    name: "Indiekit",
    repository: package_.repository,
    themeColor: "#0055ee",
    themeColorScheme: "automatic",
    ttl: 604_800, // 7 days
    version: package_.version,
  },
  plugins: [
    "@indiekit/endpoint-files",
    "@indiekit/endpoint-image",
    "@indiekit/endpoint-media",
    "@indiekit/endpoint-micropub",
    "@indiekit/endpoint-posts",
    "@indiekit/endpoint-share",
    "@indiekit/endpoint-syndicate",
  ],
  publication: {
    authorizationEndpoint: "https://indieauth.com/auth",
    tokenEndpoint: "https://tokens.indieauth.com/token",
    categories: [],
    locale: "en",
    me: null,
    postTemplate: null,
    postTypes: [],
    preset: null,
    slugSeparator: "-",
    storeMessageTemplate: (metaData) =>
      `${metaData.action} ${metaData.postType} ${metaData.fileType}`,
    syndicationTargets: [],
    timeZone: "UTC",
  },
  server: {
    port: process.env.PORT || "3000",
  },
};

defaultConfig.application.sessionMiddleware = cookieSession({
  name: defaultConfig.application.name,
  secret: crypto.randomBytes(16),
});
