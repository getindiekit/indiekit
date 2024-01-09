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
    postTypes: [
      {
        type: "article",
        name: "Article",
        h: "entry",
        fields: [
          "name",
          "content",
          "summary",
          "category",
          "geo",
          "post-status",
          "published",
          "visibility",
        ],
        requiredFields: ["content", "name", "published"],
        validationSchema: [
          {
            content: validationSchemas.content,
            geo: validationSchemas.geo,
            name: validationSchemas.name,
          },
        ],
      },
      {
        type: "note",
        name: "Note",
        h: "entry",
        fields: [
          "content",
          "category",
          "geo",
          "post-status",
          "published",
          "visibility",
        ],
        requiredFields: ["content", "published"],
        validationSchema: [
          {
            content: validationSchemas.content,
            geo: validationSchemas.geo,
          },
        ],
      },
      {
        type: "photo",
        name: "Photo",
        h: "entry",
        fields: [
          "photo",
          "content",
          "category",
          "geo",
          "post-status",
          "published",
          "visibility",
        ],
        requiredFields: ["photo", "published", "mp-photo-alt"],
        validationSchema: [
          {
            geo: validationSchemas.geo,
            "photo.*.alt": validationSchemas["photo.*.alt"],
            "photo.*.url": validationSchemas["photo.*.url"],
          },
        ],
      },
      {
        type: "video",
        name: "Video",
        h: "entry",
        fields: [
          "video",
          "content",
          "category",
          "geo",
          "post-status",
          "published",
          "visibility",
        ],
        requiredFields: ["video", "published"],
        validationSchema: [
          {
            geo: validationSchemas.geo,
            "video.*": validationSchemas["video.*"],
          },
        ],
      },
      {
        type: "audio",
        name: "Audio",
        discovery: "audio",
        h: "entry",
        fields: [
          "audio",
          "content",
          "category",
          "geo",
          "post-status",
          "published",
          "visibility",
        ],
        requiredFields: ["audio", "published"],
        validationSchema: [
          {
            "audio.*": validationSchemas["audio.*"],
            geo: validationSchemas.geo,
          },
        ],
      },
      {
        type: "bookmark",
        name: "Bookmark",
        discovery: "bookmark-of",
        h: "entry",
        fields: [
          "bookmark-of",
          "name",
          "content",
          "category",
          "post-status",
          "published",
          "visibility",
        ],
        requiredFields: ["bookmark-of", "published"],
        validationSchema: [
          {
            "bookmark-of": validationSchemas["bookmark-of"],
          },
        ],
      },
      {
        type: "event",
        name: "Event",
        h: "event",
        fields: [
          "name",
          "start",
          "end",
          "url",
          "location",
          "content",
          "category",
          "post-status",
          "published",
          "visibility",
        ],
        requiredFields: ["name", "start", "published"],
        validationSchema: [
          {
            name: validationSchemas.name,
            start: validationSchemas.start,
          },
        ],
      },
      {
        type: "rsvp",
        name: "RSVP",
        h: "entry",
        fields: [
          "in-reply-to",
          "rsvp",
          "content",
          "category",
          "post-status",
          "published",
          "visibility",
        ],
        requiredFields: ["rsvp", "in-reply-to", "published"],
        validationSchema: [
          {
            "in-reply-to": validationSchemas["in-reply-to"],
            rsvp: validationSchemas.rsvp,
          },
        ],
      },
      {
        type: "reply",
        name: "Reply",
        h: "entry",
        fields: [
          "in-reply-to",
          "content",
          "category",
          "post-status",
          "published",
          "visibility",
        ],
        requiredFields: ["content", "in-reply-to", "published"],
        validationSchema: [
          {
            content: validationSchemas.content,
            "in-reply-to": validationSchemas["in-reply-to"],
          },
        ],
      },
      {
        type: "repost",
        name: "Repost",
        h: "entry",
        fields: [
          "repost-of",
          "content",
          "category",
          "post-status",
          "published",
          "visibility",
        ],
        requiredFields: ["repost-of", "published"],
        validationSchema: [
          {
            "repost-of": validationSchemas["repost-of"],
          },
        ],
      },
      {
        type: "like",
        name: "Like",
        h: "entry",
        fields: [
          "like-of",
          "category",
          "content",
          "post-status",
          "published",
          "visibility",
        ],
        requiredFields: ["like-of", "published"],
        validationSchema: [
          {
            "like-of": validationSchemas["like-of"],
          },
        ],
      },
    ],
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
