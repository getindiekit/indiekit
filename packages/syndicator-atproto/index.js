import process from "node:process";

import { IndiekitError } from "@indiekit/error";

import { atproto } from "./lib/atproto.js";

const defaults = {
  checked: false,
  includePermalink: false,
  password: process.env.ATPROTO_PASSWORD,
  user: "",
};

export default class AtProtoSyndicator {
  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.profileUrl] - Profile URL
   * @param {string} [options.serviceUrl] - Service URL
   * @param {string} [options.user] - Username
   * @param {string} [options.password] - Password
   * @param {boolean} [options.includePermalink] - Include permalink in status
   * @param {boolean} [options.checked] - Check syndicator in UI
   */
  constructor(options = {}) {
    this.name = "AT Protocol syndicator";
    this.options = { ...defaults, ...options };
  }

  get #profileUrl() {
    const userName = this.options.user.replace("@", "");
    return this.options?.profileUrl
      ? new URL(this.options.profileUrl).href + "/" + userName
      : false;
  }

  get #serviceUrl() {
    return this.options?.serviceUrl
      ? new URL(this.options.serviceUrl).href
      : false;
  }

  get #user() {
    return this.options?.user
      ? `@${this.options.user.replace("@", "")}`
      : false;
  }

  get environment() {
    return ["ATPROTO_PASSWORD"];
  }

  get info() {
    const service = {
      name: "AT Protocol",
      photo: "/assets/@indiekit-atproto/icon.svg",
    };
    const profileUrl = this.#profileUrl;
    const serviceUrl = this.#serviceUrl;
    const user = this.#user;

    if (!profileUrl) {
      return {
        error: "Profile URL required",
        service,
      };
    }

    if (!serviceUrl) {
      return {
        error: "Service URL required",
        service,
      };
    }

    if (!user) {
      return {
        error: "User identifier required",
        service,
      };
    }

    const uid = profileUrl;
    service.url = serviceUrl;

    const thing = {
      checked: this.options.checked,
      name: user,
      uid,
      service,
      user: {
        name: user,
        url: uid,
      },
    };

    return thing;
  }

  async syndicate(properties, publication) {
    try {
      return await atproto({
        identifier: this.options.user,
        password: this.options.password,
        includePermalink: this.options.includePermalink,
        profileUrl: this.#profileUrl && this.#profileUrl,
        serviceUrl: this.#serviceUrl && this.#serviceUrl,
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
