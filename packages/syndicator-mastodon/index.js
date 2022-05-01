import path from "node:path";
import process from "node:process";
import { mastodon } from "./lib/mastodon.js";

const defaults = {
  accessToken: process.env.MASTODON_ACCESS_TOKEN,
  checked: false,
};

export const MastodonSyndicator = class {
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
    return mastodon({
      url: `${this.#url.protocol}//${this.#url.hostname}`,
      accessToken: this.options.accessToken,
    }).post(properties, publication);
  }

  init(Indiekit) {
    Indiekit.addSyndicator(this);
  }
};

export default MastodonSyndicator;
