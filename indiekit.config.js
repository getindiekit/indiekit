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
    "@indiekit/syndicator-mastodon",
    "@indiekit/syndicator-twitter",
  ],
  publication: {
    me: process.env.PUBLICATION_URL,
    categories: ["internet", "indieweb", "indiekit", "test", "testing"],
  },
  "@indiekit/store-github": {
    user: process.env.GITHUB_USER,
    repo: process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH,
  },
  "@indiekit/syndicator-mastodon": {
    checked: true,
    url: process.env.MASTODON_URL,
    user: process.env.MASTODON_USER,
  },
  "@indiekit/syndicator-twitter": {
    checked: true,
    user: process.env.TWITTER_USER,
  },
};

export default config;
