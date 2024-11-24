import process from "node:process";

export const defaultConfig = {
  application: {
    mongodbUrl: process.env.MONGO_URL || false,
    name: "Indiekit",
    port: process.env.PORT || "3000",
    themeColor: "#04f",
    themeColorScheme: "automatic",
    timeZone: "UTC",
    ttl: 604_800, // 7 days
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
