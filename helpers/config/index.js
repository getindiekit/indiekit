import process from "node:process";
import "dotenv/config.js";
import cookieSession from "cookie-session";

const defaultOptions = {
  locale: "en",
  usePostTypes: true,
};

export const testConfig = async (options) => {
  options = { ...defaultOptions, ...options };

  // Configure custom note post type with date-less URL for easier testing
  const postTypes = {
    note: {
      name: "Custom note post type",
      post: {
        path: "src/content/notes/{slug}.md",
        url: "notes/{slug}/",
      },
    },
    photo: {
      name: "Custom photo post type",
      post: {
        path: "src/content/photos/{slug}.md",
        url: "photos/{slug}/",
      },
      media: {
        path: "src/media/photos/{filename}",
        url: "media/photos/{filename}",
      },
    },
  };

  return {
    application: {
      introspectionEndpoint: options?.application?.introspectionEndpoint,
      locale: options.locale,
      mediaEndpoint: options?.application?.mediaEndpoint,
      mongodbUrl: options.mongodbUrl,
      name: "Test configuration",
      sessionMiddleware: cookieSession({
        name: "test",
        secret: process.env.SECRET,
      }),
      timeZone: "UTC",
      tokenEndpoint: options?.application?.tokenEndpoint,
    },
    plugins: ["@indiekit-test/store", ...(options.plugins || [])],
    publication: {
      me: options?.publication?.me || "https://website.example",
      ...(options.usePostTypes && { postTypes }),
    },
    "@indiekit-test/store": {
      user: "user",
    },
    "@indiekit/syndicator-mastodon": {
      checked: true,
      url: "https://mastodon.example",
      user: "username",
      accessToken: "abcd1234",
    },
  };
};
