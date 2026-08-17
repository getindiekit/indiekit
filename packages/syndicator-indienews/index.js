export default class SyndicatorIndienews {
  name = "IndieNews syndicator";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.language] - Language code (default: "en")
   */
  constructor(options = {}) {
    this.language = options.language ?? "en";
    this.checked = options.checked ?? false;
  }

  get info() {
    const uid = `https://news.indieweb.org/${this.language}/`;
    return {
      checked: this.checked,
      name: `IndieNews (${this.language})`,
      uid,
      service: {
        name: "IndieNews",
        photo: "https://news.indieweb.org/favicon.ico",
        url: "https://news.indieweb.org",
      },
    };
  }

  async getSyndicationUrl() {
    return this.info.uid;
  }

  init(Indiekit) {
    Indiekit.addSyndicator(this);
  }
}
