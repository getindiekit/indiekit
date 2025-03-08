import path from "node:path";
import process from "node:process";

import { IndiekitError } from "@indiekit/error";
import { IndiekitSyndicatorPlugin } from "@indiekit/plugin";

import { mastodon } from "./lib/mastodon.js";

const defaults = {
  accessToken: process.env.MASTODON_ACCESS_TOKEN,
  characterLimit: 500,
  checked: false,
  includePermalink: false,
  url: "https://mastodon.social",
};

export default class MastodonSyndicatorPlugin extends IndiekitSyndicatorPlugin {
  environment = ["MASTODON_ACCESS_TOKEN"];

  name = "Mastodon syndicator";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.accessToken] - Access token
   * @param {number} [options.characterLimit] - Server character limit
   * @param {boolean} [options.checked] - Check syndicator in UI
   * @param {boolean} [options.includePermalink] - Include permalink in status
   * @param {string} [options.url] - Server URL
   * @param {string} [options.user] - Username
   */
  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };

    this.info = {
      checked: this.options.checked,
      name: `${this.#user}@${this.#url.hostname}`,
      uid: this.#uid,
      service: {
        name: "Mastodon",
        photo: "/assets/@indiekit-syndicator-mastodon/icon.svg",
        url: this.#url.href,
      },
      user: {
        name: this.#user,
        url: this.#uid,
      },
    };

    /**
     * @type {import('prompts').PromptObject[]}
     */
    this.prompts = [
      {
        type: "text",
        name: "url",
        message: "What is the URL of your Mastodon server?",
        initial: this.#url.href,
      },
      {
        type: "text",
        name: "user",
        message: "What is your Mastodon username (without the @)?",
      },
    ];
  }

  /**
   * Instance URL object
   * @type {URL}
   */
  get #url() {
    return new URL(this.options.url);
  }

  /**
   * Ensure username is prefixed with `@`
   * @type {string}
   */
  get #user() {
    return this.options?.user ? `@${this.options.user.replace("@", "")}` : "";
  }

  /**
   * Resolved UID
   * @type {string}
   */
  get #uid() {
    return `${this.#url.protocol}//${path.join(this.#url.hostname, this.#user)}`;
  }

  async syndicate(properties) {
    try {
      return await mastodon({
        accessToken: this.options.accessToken,
        characterLimit: this.options.characterLimit,
        includePermalink: this.options.includePermalink,
        serverUrl: `${this.#url.protocol}//${this.#url.hostname}`,
      }).post(properties, this.indiekit.publication.me);
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.statusCode,
      });
    }
  }
}
