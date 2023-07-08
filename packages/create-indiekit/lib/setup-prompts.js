import { isUrl } from "@indiekit/util";

export const setupPrompts = [
  {
    type: "text",
    name: "me",
    message: "What is your website’s URL?",
    description: "i.e. https://website.example",
    validate: (value) =>
      isUrl(value)
        ? true
        : "Enter a valid URL, for example, https://website.example",
  },
  {
    type: "confirm",
    name: "usePreset",
    message: "Do you want to use a publication preset?",
  },
  {
    type: (previous) => (previous === true ? "select" : undefined),
    name: "presetPlugin",
    message: "Which publication preset do you want to use?",
    choices: [
      {
        title: "Hugo",
        value: "@indiekit/preset-hugo",
      },
      {
        title: "Jekyll",
        value: "@indiekit/preset-jekyll",
      },
      {
        title: "No preset",
        value: false,
      },
    ],
  },
  {
    type: "select",
    name: "storePlugin",
    message: "Where do you want to store your content?",
    choices: [
      {
        title: "Bitbucket",
        value: "@indiekit/store-bitbucket",
      },
      {
        title: "FTP",
        value: "@indiekit/store-ftp",
      },
      {
        title: "Gitea",
        value: "@indiekit/store-gitea",
      },
      {
        title: "GitHub",
        value: "@indiekit/store-github",
      },
      {
        title: "GitLab",
        value: "@indiekit/store-gitlab",
      },
    ],
  },
  {
    type: "confirm",
    name: "useSyndication",
    message: "Do you want to syndicate your posts to other websites?",
  },
  {
    type: (previous) => (previous === true ? "multiselect" : undefined),
    name: "syndicatorPlugins",
    message: "Which websites do you want to syndicate your posts to?",
    choices: [
      {
        title: "Mastodon",
        value: "@indiekit/syndicator-mastodon",
      },
      {
        title: "Twitter",
        value: "@indiekit/syndicator-twitter",
      },
    ],
  },
];
