module.exports = {
  plugins: [
    "@indiekit/preset-jekyll",
    "@indiekit/store-github",
    "@indiekit/syndicator-mastodon",
    "@indiekit/syndicator-twitter",
  ],
  publication: {
    me: process.env.PUBLICATION_URL,
    timeZone: "Europe/London",
  },
  "@indiekit/store-github": {
    user: "getindiekit",
    repo: "sandbox",
    branch: "gh-pages",
  },
  "@indiekit/syndicator-mastodon": {
    checked: true,
    forced: true,
    url: "https://mastodon.social",
    user: "indiekit_sandbox",
  },
  "@indiekit/syndicator-twitter": {
    checked: true,
    forced: true,
    user: "indiekitsandbox",
  },
};
