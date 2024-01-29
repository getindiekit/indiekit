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
    timeZone: process.env.TZ,
  },
  plugins: [
    "@indiekit-test/frontend",
    "@indiekit/endpoint-json-feed",
    "@indiekit/preset-jekyll",
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
        fields: ["like-of", "published"],
        requiredFields: ["like-of", "published"],
      },
      jam: {
        name: "Jam",
        discovery: "jam-of",
        h: "entry",
        fields: ["jam-of", "content", "post-status", "published"],
        requiredFields: ["jam-of", "published"],
        post: {
          path: "_jams/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "jams/{yyyy}/{MM}/{dd}/{slug}",
        },
      },
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
