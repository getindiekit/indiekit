import path from "node:path";
import process from "node:process";
import makeDebug from "debug";
import { IndiekitError } from "@indiekit/error";
import { mastodon } from "./lib/mastodon.js";

const debug = makeDebug(`indiekit-syndicator:mastodon`);

const defaults = {
  accessToken: process.env.MASTODON_ACCESS_TOKEN,
  characterLimit: 500,
  checked: false,
  includePermalink: false,
};

export default class MastodonSyndicator {
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
    this.name = "Mastodon syndicator";
    this.options = { ...defaults, ...options };
  }

  get #url() {
    return this.options?.url ? new URL(this.options.url) : false;
  }

  get #user() {
    return this.options?.user
      ? `@${this.options.user.replace("@", "")}`
      : false;
  }

  get environment() {
    return ["MASTODON_ACCESS_TOKEN"];
  }

  get info() {
    const service = {
      name: "Mastodon",
      photo: "/assets/@indiekit-syndicator-mastodon/icon.svg",
    };
    const user = this.#user;
    const url = this.#url;

    if (!url) {
      return {
        error: "Server URL required",
        service,
      };
    }

    if (!user) {
      return {
        error: "User name required",
        service,
      };
    }

    const uid = `${url.protocol}//${path.join(url.hostname, user)}`;
    service.url = url.href;

    return {
      checked: this.options.checked,
      name: `${user}@${url.hostname}`,
      uid,
      service,
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
    const server_url = this.options.url;
    const user = this.options.user;

    try {
      debug(`try syndicating to Mastodon server ${server_url} as user ${user}`);
      const url = await mastodon({
        accessToken: this.options.accessToken,
        characterLimit: this.options.characterLimit,
        includePermalink: this.options.includePermalink,
        serverUrl: `${this.#url.protocol}//${this.#url.hostname}`,
      }).post(properties, publication.me);
      debug(`syndicated to Mastodon server ${server_url} as user ${user}`);
      return url;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.statusCode,
      });
    }
  }

  init(Indiekit) {
    const required_configs = ["accessToken", "url", "user"];
    for (const required of required_configs) {
      if (!this.options[required]) {
        const message = `could not initialize ${this.name}: ${required} not set. See https://npmjs.org/package/@indiekit/syndicator-mastodon for details.`;
        debug(message);
        console.error(message);
        throw new Error(message);
      }
    }
    Indiekit.addSyndicator(this);
  }
}
