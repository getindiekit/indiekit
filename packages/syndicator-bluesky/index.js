import process from "node:process";

import { IndiekitError } from "@indiekit/error";

import { Bluesky } from "./lib/bluesky.js";

const defaults = {
  handle: "",
  password: process.env.BLUESKY_PASSWORD,
  profileUrl: "https://bsky.app/profile",
  serviceUrl: "https://bsky.social",
  includeCategories: false,
  includePermalink: false,
  checked: false,
};

export default class BlueskySyndicator {
  name = "Bluesky syndicator";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.profileUrl] - Profile URL
   * @param {string} [options.serviceUrl] - Service URL
   * @param {string} [options.handle] - Handle
   * @param {string} [options.password] - Password
   * @param {boolean} [options.includeCategories] - Add categories as hashtags
   * @param {boolean} [options.includePermalink] - Include permalink in status
   * @param {boolean} [options.checked] - Check syndicator in UI
   */
  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }

  get #profileUrl() {
    return new URL(this.options.profileUrl).href;
  }

  get #serviceUrl() {
    return new URL(this.options.serviceUrl).href;
  }

  get #user() {
    return this.options?.handle
      ? `@${this.options.handle.replace("@", "")}`
      : false;
  }

  get environment() {
    return ["BLUESKY_PASSWORD"];
  }

  get info() {
    const info = {
      checked: this.options.checked,
      service: {
        name: "Bluesky",
        photo: "/assets/@indiekit-syndicator-bluesky/icon.svg",
      },
    };

    if (
      !URL.canParse(this.options.profileUrl) ||
      !URL.canParse(this.options.serviceUrl)
    ) {
      info.error = "Valid profile URL required";
      return info;
    }

    const username = this.options?.handle?.replace("@", "");
    const url = this.#profileUrl + "/" + username;

    info.name = this.#user;
    info.uid = url;
    info.service.url = this.#serviceUrl;
    info.user = { name: this.#user, url };

    if (!this.#user) {
      info.error = "User identifier required";
    }

    return info;
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "handle",
        message: "What is your Bluesky handle (without the @)?",
      },
    ];
  }

  async syndicate(properties, publication) {
    try {
      const bluesky = new Bluesky({
        identifier: this.options?.handle,
        password: this.options?.password,
        profileUrl: this.#profileUrl,
        serviceUrl: this.#serviceUrl,
        includeCategories: this.options.includeCategories,
        includePermalink: this.options.includePermalink,
      });

      return await bluesky.post(properties, publication.me);
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
