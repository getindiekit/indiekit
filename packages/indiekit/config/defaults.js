import { createRequire } from "node:module";
import process from "node:process";
import { validationSchemas } from "@indiekit/util";
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
      "es-419",
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
    validationSchemas,
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
    postTypes: {
      article: {
        name: "Article",
        fields: {
          name: { required: true },
          content: { required: true },
          summary: {},
          category: {},
          geo: {},
          "post-status": {},
          published: { required: true },
          visibility: {},
        },
      },
      note: {
        name: "Note",
        fields: {
          content: { required: true },
          category: {},
          geo: {},
          "post-status": {},
          published: { required: true },
          visibility: {},
        },
      },
      photo: {
        name: "Photo",
        fields: {
          photo: { required: true },
          content: {},
          category: {},
          geo: {},
          "post-status": {},
          "mp-photo-alt": { required: true },
          published: { required: true },
          visibility: {},
        },
      },
      video: {
        name: "Video",
        fields: {
          video: { required: true },
          content: {},
          category: {},
          geo: {},
          "post-status": {},
          published: { required: true },
          visibility: {},
        },
      },
      audio: {
        name: "Audio",
        discovery: "audio",
        fields: {
          audio: { required: true },
          content: {},
          category: {},
          geo: {},
          "post-status": {},
          published: { required: true },
          visibility: {},
        },
      },
      bookmark: {
        name: "Bookmark",
        discovery: "bookmark-of",
        fields: {
          "bookmark-of": { required: true },
          name: {},
          content: {},
          category: {},
          "post-status": {},
          published: { required: true },
          visibility: {},
        },
      },
      event: {
        name: "Event",
        h: "event",
        fields: {
          name: { required: true },
          start: { required: true },
          end: {},
          url: {},
          location: {},
          content: {},
          category: {},
          "post-status": {},
          published: { required: true },
          visibility: {},
        },
      },
      rsvp: {
        name: "RSVP",
        fields: {
          "in-reply-to": { required: true },
          rsvp: { required: true },
          content: {},
          category: {},
          "post-status": {},
          published: { required: true },
          visibility: {},
        },
      },
      reply: {
        name: "Reply",
        fields: {
          "in-reply-to": { required: true },
          content: { required: true },
          category: {},
          "post-status": {},
          published: { required: true },
          visibility: {},
        },
      },
      repost: {
        name: "Repost",
        fields: {
          "repost-of": { required: true },
          content: {},
          category: {},
          "post-status": {},
          published: { required: true },
          visibility: {},
        },
      },
      like: {
        name: "Like",
        fields: {
          "like-of": { required: true },
          category: {},
          content: {},
          "post-status": {},
          published: { required: true },
          visibility: {},
        },
      },
    },
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
});
