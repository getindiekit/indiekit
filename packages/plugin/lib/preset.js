import makeDebug from "debug";

import { IndiekitPlugin } from "./base.js";

const debug = makeDebug(`indiekit:plugin`);

/**
 * @typedef PostTypeConfiguration
 * @property {string} name - Post type name
 * @property {object} [post] - Post paths
 * @property {string} [post.path] - File location for post in content store
 * @property {string} [post.url] - Public post permalink URL
 * @property {object} [media] - Media paths
 * @property {string} [media.path] - File location for media in content store
 * @property {string} [media.url] - Public media permalink URL
 */

/**
 * @typedef PresetInformation
 * @property {string} name - Name of publishing software
 */

/**
 * Publication preset plug-in
 * @class
 * @augments {IndiekitPlugin}
 */
export class IndiekitPresetPlugin extends IndiekitPlugin {
  /**
   * Present information
   * @type {PresetInformation}
   */
  info = undefined;

  /**
   * Post types
   * @type {{[key: string]: PostTypeConfiguration}}
   */
  get postTypes() {
    return {};
  }

  /**
   * Post template
   * @param {object} properties - JF2 properties
   * @returns {string} Post template
   */
  postTemplate(properties) {
    return JSON.stringify(properties);
  }

  #addPreset() {
    debug(`Adding publication preset: ${this.name}`);
    this.indiekit.publication.preset = this;
  }

  async init() {
    await super.init();

    this.#addPreset();
  }
}
