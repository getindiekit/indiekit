/**
 * @import { Indiekit } from "@indiekit/indiekit";
 */

/**
 * @typedef {object} IndieNewsPluginOptions
 * @property {string} [language] - IndieNews language code (default: "en")
 * @property {boolean} [checked] - Pre-check in Micropub clients (default: false)
 */

/**
 * Create a single IndieNews syndicator target for a given language.
 * @param {IndieNewsPluginOptions} options - Options object (per language)
 * @returns {object} Syndicator target
 */
function createTarget(options = {}) {
  const language = options.language ?? "en";
  const checked = options.checked ?? false;
  const uid = `https://news.indieweb.org/${language}/`;

  return {
    get info() {
      return {
        checked,
        name: `IndieNews (${language})`,
        uid,
        service: {
          name: "IndieNews",
          photo: "https://news.indieweb.org/favicon.ico",
          url: "https://news.indieweb.org",
        },
      };
    },

    async getSyndicationUrl() {
      return uid;
    },
  };
}

export default class SyndicatorIndieNews {
  name = "IndieNews Syndicator";

  /**
   * @param {IndieNewsPluginOptions | IndieNewsPluginOptions[]} [options] - Plug-in options, or array of options for multiple languages
   */
  constructor(options = {}) {
    this.targets = [options].flat().map((options) => createTarget(options));
  }

  /**
   * @param {Indiekit} Indiekit - Indiekit instance
   */
  init(Indiekit) {
    Indiekit.addSyndicator(this.targets);
  }
}
