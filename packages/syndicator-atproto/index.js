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
   * @param {boolean} [options.includePermalink] - Include permalink in status
   * @param {string} [options.password] - Password
   * @param {string} [options.url] - Server URL
   * @param {string} [options.user] - Username
   * @param {boolean} [options.checked] - Check syndicator in UI
   */
  constructor(options = {}) {
    this.name = "AT Protocol syndicator";
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
    return ["ATPROTO_PASSWORD"];
  }

  get info() {
    const service = {
      name: "AT Protocol",
      photo: "/assets/@indiekit-atproto/icon.svg",
    };
    const user = this.#user;
    const url = this.#url;

    if (!url) {
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

    const uid = `${url.protocol}//${this.options.user.replace("@", "")}`;
    service.url = url.href;

    return {
      checked: this.options.checked,
      name: user,
      uid,
      service,
      user: {
        name: user,
        url: uid,
      },
    };
  }

  async syndicate(properties, publication) {
    try {
      return await atproto({
        identifier: this.options.user,
        password: this.options.password,
        includePermalink: this.options.includePermalink,
        service: `${this.#url.protocol}//${this.#url.hostname}`,
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
