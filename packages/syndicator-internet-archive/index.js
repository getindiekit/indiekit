import process from "node:process";
import Debug from "debug";
import { internetArchive } from "./lib/internet-archive.js";

export const debug = new Debug("indiekit:syndicator-internet-archive");

const defaults = {
  accessKey: process.env.INTERNET_ARCHIVE_ACCESS_KEY,
  secretKey: process.env.INTERNET_ARCHIVE_SECRET_KEY,
  checked: false,
  name: "Internet Archive",
  uid: "https://web.archive.org/",
};

export const InternetArchiveSyndicator = class {
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
    return internetArchive(this.options).save(properties);
  }

  init(Indiekit) {
    Indiekit.addSyndicator(this);
  }
};

export default InternetArchiveSyndicator;
