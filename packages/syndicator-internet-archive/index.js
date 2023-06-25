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
   * @param {object} [options] - Plugin options
   * @param {string} [options.accessKey] - S3 access key
   * @param {string} [options.secretKey] - S3 secret key
   * @param {boolean} [options.checked] - Check syndicator in UI
   * @param {boolean} [options.forced] - Force syndicator
   */
  constructor(options = {}) {
    this.id = "internet-archive";
    this.meta = import.meta;
    this.name = "Internet Archive syndicator";
    this.options = { ...defaults, ...options };
  }

  get info() {
    return {
      checked: this.options.checked,
      name: this.options.name,
      uid: this.options.uid,
      service: {
        name: "Internet Archive",
        url: "https://web.archive.org/",
        photo: "/assets/internet-archive/icon.svg",
      },
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
