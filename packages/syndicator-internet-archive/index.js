import process from "node:process";

import { IndiekitError } from "@indiekit/error";

import { InternetArchive } from "./lib/internet-archive.js";

const defaults = {
  accessKey: process.env.INTERNET_ARCHIVE_ACCESS_KEY,
  secretKey: process.env.INTERNET_ARCHIVE_SECRET_KEY,
  checked: false,
  name: "Internet Archive",
  uid: "https://web.archive.org/",
};

export default class InternetArchiveSyndicator {
  name = "Internet Archive syndicator";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.accessKey] - S3 access key
   * @param {string} [options.secretKey] - S3 secret key
   * @param {boolean} [options.checked] - Check syndicator in UI
   */
  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }

  get environment() {
    return ["INTERNET_ARCHIVE_ACCESS_KEY", "INTERNET_ARCHIVE_SECRET_KEY"];
  }

  get info() {
    const info = {
      checked: this.options.checked,
      name: this.options.name,
      uid: this.options.uid,
      service: {
        name: "Internet Archive",
        url: "https://web.archive.org/",
        photo: "/assets/@indiekit-syndicator-internet-archive/icon.svg",
      },
    };

    if (!this.options?.secretKey) {
      info.error = "Secret key required";
    }

    if (!this.options?.accessKey) {
      info.error = "Access key required";
    }

    return info;
  }

  async syndicate(properties) {
    try {
      const internetArchive = new InternetArchive({
        accessKey: this.options.accessKey,
        secretKey: this.options.secretKey,
      });

      return await internetArchive.save(properties);
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
