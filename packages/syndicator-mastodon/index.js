import path from "node:path";
import process from "node:process";
import { IndiekitError } from "@indiekit/error";
import { mastodon } from "./lib/mastodon.js";

const defaults = {
  accessToken: process.env.MASTODON_ACCESS_TOKEN,
  characterLimit: 500,
  checked: false,
};

export default class MastodonSyndicator {
  constructor(options = {}) {
    this.id = "mastodon";
    this.meta = import.meta;
    this.name = "Mastodon syndicator";
    this.options = { ...defaults, ...options };
  }

  get #url() {
    if (this.options.url) {
      return new URL(this.options.url);
    }

    throw new Error("Mastodon server URL required");
  }

  get info() {
    let { checked, user } = this.options;
    user = `@${user.replace("@", "")}`;
    const url = this.#url;
    const uid = `${url.protocol}//${path.join(url.hostname, user)}`;

    return {
      checked,
      name: `${user}@${url.hostname}`,
      uid,
      service: {
        name: "Mastodon",
        url: url.href,
        photo: "/assets/mastodon/icon.svg",
      },
      user: {
        name: user,
        url: uid,
      },
    };
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "url",
        message: "What is the URL of your Mastodon server?",
        description: "i.e. https://mastodon.social",
      },
      {
        type: "text",
        name: "user",
        message: "What is your Mastodon username (without the @)?",
      },
    ];
  }

  async syndicate(properties, publication) {
    try {
      return await mastodon({
        accessToken: this.options.accessToken,
        characterLimit: this.options.characterLimit,
        serverUrl: `${this.#url.protocol}//${this.#url.hostname}`,
      }).post(properties, publication);
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
