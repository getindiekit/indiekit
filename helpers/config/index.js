import process from "node:process";
import "dotenv/config.js"; // eslint-disable-line import/no-unassigned-import
import cookieSession from "cookie-session";
import { MongoMemoryServer } from "mongodb-memory-server";

const defaultOptions = {
  locale: "en",
  useDatabase: true,
  usePostTypes: true,
  usePreset: true,
};

export const testConfig = async (options) => {
  options = { ...defaultOptions, ...options };

  // Configure MongoDb
  const mongod = await MongoMemoryServer.create();
  const mongodbUrl = mongod.getUri();

  // Configure custom note post type with date-less URL for easier testing
  const postTypes = [
    {
      type: "note",
      name: "Custom note post type",
      post: {
        path: "src/content/notes/{slug}.md",
        url: "notes/{slug}/",
      },
    },
  ];

  return {
    application: {
      locale: options.locale,
      mongodbUrl: options && options.useDatabase !== false ? mongodbUrl : false,
      name: "Test configuration",
      sessionMiddleware: cookieSession({
        name: "test",
        secret: process.env.SECRET,
      }),
      tokenEndpoint: options?.application?.tokenEndpoint,
    },
    plugins: [
      "@indiekit-test/store",
      ...(options.usePreset ? ["@indiekit/preset-jekyll"] : []),
      ...(options.plugins || []),
    ],
    publication: {
      me: options?.publication?.me || "https://website.example",
      ...(options.usePostTypes && { postTypes }),
      timeZone: "UTC",
    },
    "@indiekit-test/store": {
      user: "user",
    },
    "@indiekit/syndicator-twitter": {
      checked: true,
      user: "username",
      apiKey: "abcd1234",
      apiKeySecret: "abcd1234",
      accessToken: "abcd1234",
      accessTokenSecret: "abcd1234",
    },
    "@indiekit/syndicator-mastodon": {
      checked: true,
      url: "https://social.example",
      user: "username",
      accessToken: "abcd1234",
    },
  };
};
