import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { mastodon } from "./lib/mastodon.js";

const defaults = {
  accessToken: process.env.MASTODON_ACCESS_TOKEN,
  checked: false,
};

export const MastodonSyndicator = class {
  constructor(options = {}) {
    this.id = "mastodon";
    this.name = "Mastodon syndicator";
    this.user = `@${options.user.replace("@", "")}`;
    this.options = { ...defaults, ...options };
  }

  get url() {
    if (this.options.url) {
      return new URL(this.options.url);
    }

    throw new Error("Mastodon server URL required");
  }

  get assetsPath() {
    return fileURLToPath(new URL("assets", import.meta.url));
  }

  get info() {
    const { checked } = this.options;
    const { url, user } = this;
    const uid = `${url.protocol}//${path.join(url.hostname, user)}`;

    return {
      checked,
      name: `${user}@${url.hostname}`,
      uid,
      service: {
        name: "Mastodon",
        url: url.href,
        photo: "/assets/mastodon/icon.svg",
      },
      user: {
        name: user,
        url: uid,
      },
    };
  }

  get uid() {
    return this.info.uid;
  }

  async syndicate(properties, publication) {
    return mastodon({
      url: `${this.url.protocol}//${this.url.hostname}`,
      accessToken: this.options.accessToken,
    }).post(properties, publication);
  }
};

export default MastodonSyndicator;
