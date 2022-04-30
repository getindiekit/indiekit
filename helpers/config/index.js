import process from "node:process";
import "dotenv/config.js"; // eslint-disable-line import/no-unassigned-import
import cookieSession from "cookie-session";
import { MongoMemoryServer } from "mongodb-memory-server";

const defaultOptions = {
  locale: "en",
  useDatabase: true,
  useSyndicator: true,
};

export const testConfig = async (options) => {
  options = { ...defaultOptions, ...options };

  // Configure MongoDb
  const mongod = await MongoMemoryServer.create();
  const mongodbUrl = mongod.getUri();

  // Configure note post type with date-less URL for easier testing
  const postTypes = [
    {
      type: "note",
      name: "Note",
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
        secret: process.env.TEST_SESSION_SECRET,
      }),
    },
    plugins: [
      "@indiekit/preset-jekyll",
      "@indiekit/store-github",
      ...(options.useSyndicator ? ["@indiekit/syndicator-twitter"] : []),
    ],
    publication: {
      me: options?.publication?.me || process.env.TEST_PUBLICATION_URL,
      postTypes,
      timeZone: "UTC",
      tokenEndpoint: options?.publication?.tokenEndpoint,
    },
    "@indiekit/store-github": {
      token: "abc123",
      user: "username",
      repo: "repo",
    },
    "@indiekit/syndicator-twitter": {
      checked: true,
      user: "username",
      apiKey: "abc123",
      apiKeySecret: "abc123",
      accessToken: "abc123",
      accessTokenSecret: "abc123",
    },
  };
};
