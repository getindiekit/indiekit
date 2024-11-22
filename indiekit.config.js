import process from "node:process";
import * as dotenv from "dotenv";

dotenv.config();

const config = {
  application: {
    locale: "en-GB",
    mongodbUrl: process.env.MONGO_URL,
    ...(process.env.RAILWAY_ENVIRONMENT && {
      url: `https://${process.env.RAILWAY_STATIC_URL}`,
    }),
    name: "Indiekit Test Server",
    themeColor: process.env.THEME_COLOR,
    timeZone: "Europe/London",
  },
  plugins: [
    "@indiekit-test/frontend",
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
    channels: {
      posts: {
        name: "Posts",
      },
      pages: {
        name: "Pages",
      },
    },
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
      photo: {
        post: {
          path: "_photos/{yyyy}-{MM}-{dd}-{slug}.markdown",
          url: "photos/{yyyy}/{DDD}/{slug}/",
        },
        media: {
          path: "media/photos/{yyyy}/{DDD}/{slug}/{filename}",
          url: "media/photos/{yyyy}/{DDD}/{slug}/{filename}",
        },
      },
    },
  },
  "@indiekit/endpoint-media": {
    imageProcessing: {
      resize: {
        width: 320,
        height: 320,
      },
    },
  },
  "@indiekit/store-github": {
    user: process.env.GITHUB_USER,
    repo: process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH,
  },
  "@indiekit/store-s3": {
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    bucket: process.env.S3_BUCKET,
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
