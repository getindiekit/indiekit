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
  /**
   * @param {object} [options] - Plugin options
   * @param {string} [options.accessToken] - Access token
   * @param {string} [options.characterLimit] - Server character limit
   * @param {string} [options.url] - Server URL
   * @param {string} [options.user] - Username
   * @param {boolean} [options.checked] - Check syndicator in UI
   * @param {boolean} [options.forced] - Force syndicator
   */
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

  get #user() {
    if (this.options.user) {
      return `@${this.options.user.replace("@", "")}`;
    }

    throw new Error("Mastodon user name required");
  }

  get info() {
    const { checked } = this.options;
    const user = this.#user;
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
      }).post(properties, publication.me);
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
