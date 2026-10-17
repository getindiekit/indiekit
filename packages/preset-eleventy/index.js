import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";

export default class EleventyPreset {
  name = "Eleventy preset";

  /**
   * @type {Record<string, Partial<IndiekitPostType>>|undefined}
   */
  postTypes;

  get info() {
    return {
      name: "Eleventy",
    };
  }

  /**
   * Get post template
   * @param {Jf2Properties} properties - JF2 properties
   * @returns {string} Rendered post template
   */
  postTemplate(properties) {
    return getPostTemplate(properties);
  }

  /**
   * @param {IndiekitInstance} Indiekit - Indiekit instance
   */
  init(Indiekit) {
    this.postTypes = getPostTypes(Indiekit.postTypes);

    Indiekit.addPreset(this);
  }
}
