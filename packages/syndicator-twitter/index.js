import process from "node:process";
import { IndiekitError } from "@indiekit/error";
import { twitter } from "./lib/twitter.js";

const defaults = {
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  apiKey: process.env.TWITTER_API_KEY,
  apiKeySecret: process.env.TWITTER_API_KEY_SECRET,
  checked: false,
};

export default class TwitterSyndicator {
  constructor(options = {}) {
    this.id = "twitter";
    this.meta = import.meta;
    this.name = "Twitter syndicator";
    this.options = { ...defaults, ...options };
  }

  get info() {
    const { checked, user } = this.options;

    return {
      checked,
      name: `${user} on Twitter`,
      uid: `https://twitter.com/${user}`,
      service: {
        name: "Twitter",
        url: "https://twitter.com/",
        photo: "/assets/twitter/icon.svg",
      },
      user: {
        name: user,
        url: `https://twitter.com/${user}`,
      },
    };
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "user",
        message: "What is your Twitter username?",
      },
    ];
  }

  async syndicate(properties, publication) {
    try {
      return await twitter(this.options).post(properties, publication);
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  init(Indiekit) {
    Indiekit.addSyndicator(this);
  }
}
