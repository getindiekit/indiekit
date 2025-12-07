import path from "node:path";
import process from "node:process";

import { IndiekitError } from "@indiekit/error";

import { Mastodon } from "./lib/mastodon.js";

const defaults = {
  accessToken: process.env.MASTODON_ACCESS_TOKEN,
  url: "https://mastodon.social",
  characterLimit: 500,
  checked: false,
  includePermalink: false,
};

export default class MastodonSyndicator {
  name = "Mastodon syndicator";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.accessToken] - Access token
   * @param {number} [options.characterLimit] - Server character limit
   * @param {boolean} [options.includePermalink] - Include permalink in status
   * @param {string} [options.url] - Server URL
   * @param {string} [options.user] - Username
   * @param {boolean} [options.checked] - Check syndicator in UI
   */
  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }

  get #url() {
    return new URL(this.options.url);
  }

  get #user() {
    return this.options?.user ? `@${this.options.user.replace("@", "")}` : "";
  }

  get environment() {
    return ["MASTODON_ACCESS_TOKEN"];
  }

  get info() {
    const user = this.#user;
    const url = this.#url;
    const uid = `${url.protocol}//${path.join(url.hostname, user)}`;

    const info = {
      checked: this.options.checked,
      name: `${user}@${url.hostname}`,
      uid,
      service: {
        name: "Mastodon",
        photo: "/assets/@indiekit-syndicator-mastodon/icon.svg",
        url: url.href,
      },
      user: {
        name: user,
        url: uid,
      },
    };

    if (!user) {
      info.error = "User name required";
    }

    return info;
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "url",
        message: "What is the URL of your Mastodon server?",
        validate: (value) =>
          URL.canParse(value)
            ? true
            : "Enter a valid URL, for example https://mastodon.social",
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
      const mastodon = new Mastodon({
        accessToken: this.options.accessToken,
        characterLimit: this.options.characterLimit,
        includePermalink: this.options.includePermalink,
        serverUrl: `${this.#url.protocol}//${this.#url.hostname}`,
      });

      return await mastodon.post(properties, publication.me);
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.statusCode,
      });
    }
  }

  init(Indiekit) {
    Indiekit.addSyndicator(this);
  }
}
