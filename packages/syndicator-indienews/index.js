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
 * @param {boolean} includeLanguage - Whether to include the language in the target name
 * @returns {object} Syndicator target
 */
function createTarget(options = {}, includeLanguage) {
  const language = options.language ?? "en";
  const languageName = new Intl.DisplayNames([language], {
    type: "language",
  }).of(language);
  const name = includeLanguage
    ? `IndieNews (${languageName ?? language})`
    : "IndieNews";
  const checked = options.checked ?? false;
  const uid = `https://news.indieweb.org/${language}`;

  return {
    name,

    get info() {
      return {
        checked,
        name,
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
    const targetOptions = [options].flat();
    this.targets = targetOptions.map((options) =>
      createTarget(options, targetOptions.length > 1),
    );
  }

  /**
   * @param {Indiekit} Indiekit - Indiekit instance
   */
  init(Indiekit) {
    Indiekit.addSyndicator(this.targets);
  }
}
