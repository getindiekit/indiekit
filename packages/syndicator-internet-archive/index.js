import process from "node:process";

import { IndiekitError } from "@indiekit/error";
import { IndiekitSyndicatorPlugin } from "@indiekit/plugin";

import { internetArchive } from "./lib/internet-archive.js";

const defaults = {
  accessKey: process.env.INTERNET_ARCHIVE_ACCESS_KEY,
  secretKey: process.env.INTERNET_ARCHIVE_SECRET_KEY,
  checked: false,
  name: "Internet Archive",
  uid: "https://web.archive.org/",
};

export default class InternetArchiveSyndicatorPlugin extends IndiekitSyndicatorPlugin {
  environment = ["INTERNET_ARCHIVE_ACCESS_KEY", "INTERNET_ARCHIVE_SECRET_KEY"];

  name = "Internet Archive syndicator";

  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };

    this.info = {
      checked: this.options.checked,
      name: "Internet Archive",
      uid: this.options.uid,
      service: {
        name: "Internet Archive",
        photo: "/assets/@indiekit-syndicator-internet-archive/icon.svg",
        url: "https://web.archive.org/",
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
}
