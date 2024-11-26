import process from "node:process";

import { IndiekitError } from "@indiekit/error";

import { internetArchive } from "./lib/internet-archive.js";

const defaults = {
  accessKey: process.env.INTERNET_ARCHIVE_ACCESS_KEY,
  secretKey: process.env.INTERNET_ARCHIVE_SECRET_KEY,
  checked: false,
  name: "Internet Archive",
  uid: "https://web.archive.org/",
};

export default class InternetArchiveSyndicator {
  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.accessKey] - S3 access key
   * @param {string} [options.secretKey] - S3 secret key
   * @param {boolean} [options.checked] - Check syndicator in UI
   */
  constructor(options = {}) {
    this.name = "Internet Archive syndicator";
    this.options = { ...defaults, ...options };
  }

  get environment() {
    return ["INTERNET_ARCHIVE_ACCESS_KEY", "INTERNET_ARCHIVE_SECRET_KEY"];
  }

  get info() {
    const service = {
      name: "Internet Archive",
      url: "https://web.archive.org/",
      photo: "/assets/@indiekit-syndicator-internet-archive/icon.svg",
    };

    if (!this.options?.accessKey) {
      return {
        error: "Access key required",
        service,
      };
    }

    if (!this.options?.secretKey) {
      return {
        error: "Secret key required",
        service,
      };
    }

    return {
      checked: this.options.checked,
      name: this.options.name,
      uid: this.options.uid,
      service,
    };
  }

  async syndicate(properties) {
    try {
      return await internetArchive(this.options).save(properties);
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
