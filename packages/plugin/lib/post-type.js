import makeDebug from "debug";

import { IndiekitPlugin } from "./base.js";

const debug = makeDebug(`indiekit:plugin`);

/**
 * @typedef {string} MicroformatsVocabulary
 * A string representing a Microformats vocabulary. Expected values are:
 * - "adr": Structured location
 * - "card": Person or organisation
 * - "entry": Syndicated content
 * - "event": Event
 * - "feed": Stream of entries
 * - "geo": WGS84 geographic coordinates
 * - "item": Arbitrary item
 * - "listing": Product listing
 * - "product": Product data
 * - "recipe": Recipe
 * @see {@link https://microformats.org/wiki/microformats2#v2_vocabularies}
 */

/**
 * @typedef {object} FieldType
 * @property {boolean} [required] - Indicates if field is required
 */

/**
 * @typedef PostTypeConfiguration
 * @property {string} name - Post type name
 * @property {MicroformatsVocabulary} [h] - Microformats vocabulary
 * @property {{[key: string]: FieldType}} fields - Input fields
 * @property {string} [discovery] - Property to identify Micropub request
 */

/**
 * Post type plug-in
 * @class
 * @augments {IndiekitPlugin}
 */
export class IndiekitPostTypePlugin extends IndiekitPlugin {
  /**
   * Post type configuration
   * @type {PostTypeConfiguration}
   */
  config = undefined;

  /**
   * Post type identifier
   * @type {string}
   * @see {@link https://indieweb.org/Category:PostType}
   */
  postType = undefined;

  #addPostType() {
    // Override post type configuration with user options
    const postTypeConfig = { ...this.config, ...this.options };

    if (postTypeConfig) {
      debug("Adding post type configuration for", this.postType);
      this.indiekit.postTypes.set(this.postType, {
        ...this.indiekit.postTypes.get(this.postType),
        ...postTypeConfig,
      });
    }
  }

  async init() {
    await super.init();

    this.#addPostType();
  }
}
