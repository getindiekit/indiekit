import process from "node:process";
import * as dotenv from "dotenv";

dotenv.config();

const config = {
  application: {
    _devMode: process.env.NODE_ENV === "development",
    mongodbUrl: process.env.MONGO_URL,
    ...(process.env.RAILWAY_ENVIRONMENT && {
      url: `https://${process.env.RAILWAY_STATIC_URL}`,
    }),
    name: "Indiekit Test Server",
    themeColor: "#f70",
    timeZone: process.env.TZ,
  },
  plugins: [
    "@indiekit-test/frontend",
    "@indiekit/endpoint-activitypub",
    "@indiekit/endpoint-json-feed",
    "@indiekit/post-type-audio",
    "@indiekit/post-type-event",
    "@indiekit/post-type-jam",
    "@indiekit/post-type-repost",
    "@indiekit/post-type-rsvp",
    "@indiekit/post-type-video",
    "@indiekit/preset-eleventy",
    "@indiekit/store-github",
    "@indiekit/syndicator-internet-archive",
    "@indiekit/syndicator-mastodon",
  ],
  publication: {
    me: process.env.PUBLICATION_URL,
    categories: ["internet", "indieweb", "indiekit", "test", "testing"],
    enrichPostData: true,
    postTypes: {
      like: {
        name: "Favourite",
        fields: {
          "like-of": { required: true },
          published: { required: true },
        },
      },
      jam: {
        name: "Jam",
        post: {
          path: "_jams/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "jams/{yyyy}/{MM}/{dd}/{slug}",
        },
      },
    },
  },
  "@indiekit/endpoint-activitypub": {
    ...(process.env.RAILWAY_ENVIRONMENT && {
      domain: process.env.RAILWAY_STATIC_URL,
    }),
    username: "indiekit",
    displayName: "Indiekit",
    summary: "Testing Indiekit’s ActivityPub integration",
    icon: {
      type: "Image",
      mediaType: "image/png",
      url: "https://avatars.githubusercontent.com/u/68553280?s=180",
      width: 180,
      height: 180,
    },
  },
  "@indiekit/store-github": {
    user: process.env.GITHUB_USER,
    repo: process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH,
  },
  "@indiekit/syndicator-internet-archive": {
    checked: false,
    accessKey: process.env.INTERNET_ARCHIVE_ACCESS_KEY,
    secretKey: process.env.INTERNET_ARCHIVE_SECRET_KEY,
  },
  "@indiekit/syndicator-mastodon": {
    checked: true,
    url: process.env.MASTODON_URL,
    user: process.env.MASTODON_USER,
  },
};

export default config;
