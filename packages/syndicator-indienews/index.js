/**
 * @typedef {object} PluginOptions
 * @property {string} [language] - IndieNews language code (default: "en")
 * @property {boolean} [checked] - Pre-check in Micropub clients (default: false)
 */

/**
 * Create a single IndieNews syndicator target for a given language.
 * @param {PluginOptions} options
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

export default class SyndicatorIndienews {
  name = "IndieNews syndicator";

  /**
   * @param {PluginOptions | PluginOptions[]} [options] - Plug-in options, or array of options for multiple languages
   */
  constructor(options = {}) {
    this.targets = [options].flat().map(createTarget);
  }

  init(Indiekit) {
    Indiekit.addSyndicator(this.targets);
  }
}
