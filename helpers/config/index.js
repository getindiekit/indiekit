import "dotenv/config.js";

const defaultOptions = {
  locale: "en",
  usePostTypes: true,
};

export const testConfig = async (options) => {
  options = { ...defaultOptions, ...options };

  // Configure custom note post type with date-less URL for easier testing
  const postTypes = {
    bookmark: {
      name: "Custom bookmark post type",
      post: {
        path: "src/content/bookmarks/{slug}.md",
        url: "bookmarks/{slug}/",
      },
    },
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
      micropubEndpoint: options?.application?.micropubEndpoint,
      mongodbUrl: options?.application?.mongodbUrl,
      name: "Test configuration",
      timeZone: "UTC",
      tokenEndpoint: options?.application?.tokenEndpoint,
    },
    plugins: ["@indiekit-test/store", ...(options.plugins || [])],
    publication: {
      categories: options?.publication?.categories,
      me: options?.publication?.me || "https://website.example",
      ...(options.usePostTypes && { postTypes }),
    },
    "@indiekit-test/store": {
      user: "user",
    },
    "@indiekit/syndicator-internet-archive": {
      checked: true,
      accessKey: "abcd1234",
      secretKey: "1234abcd",
    },
    "@indiekit/syndicator-mastodon": {
      checked: true,
      url: "https://mastodon.example",
      user: "username",
      accessToken: "abcd1234",
    },
    "@indiekit/endpoint-webmention-io": {
      token: "abcd1234",
    },
  };
};
