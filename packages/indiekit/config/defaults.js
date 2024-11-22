import { createRequire } from "node:module";
import process from "node:process";
import cookieSession from "cookie-session";
// eslint-ignore import/order
const require = createRequire(import.meta.url);
const package_ = require("../package.json");

export const defaultConfig = {
  application: {
    endpoints: [],
    localesAvailable: [
      "de",
      "en",
      "es",
      "es-419",
      "fr",
      "hi",
      "id",
      "nl",
      "pl",
      "pt",
      "sr",
      "sv",
      "zh-Hans-CN",
    ],
    mongodbUrl: process.env.MONGO_URL || false,
    name: "Indiekit",
    port: process.env.PORT || "3000",
    postTypes: {},
    repository: package_.repository,
    stores: [],
    themeColor: "#04f",
    themeColorScheme: "automatic",
    timeZone: "UTC",
    ttl: 604_800, // 7 days
    validationSchemas: {},
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
    "@indiekit/post-type-article",
    "@indiekit/post-type-bookmark",
    "@indiekit/post-type-like",
    "@indiekit/post-type-note",
    "@indiekit/post-type-photo",
    "@indiekit/post-type-reply",
  ],
  publication: {
    categories: [],
    channels: {},
    locale: "en",
    me: undefined,
    postTemplate: undefined,
    postTypes: {},
    preset: undefined,
    slugSeparator: "-",
    storeMessageTemplate: (metaData) =>
      `${metaData.action} ${metaData.postType} ${metaData.fileType}`,
    syndicationTargets: [],
  },
};

defaultConfig.application.sessionMiddleware = cookieSession({
  name: defaultConfig.application.name,
  secret: crypto.randomUUID(),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days,
});
