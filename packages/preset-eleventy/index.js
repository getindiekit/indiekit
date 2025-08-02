import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";

export default class EleventyPreset {
  name = "Eleventy preset";

  get info() {
    return {
      name: "Eleventy",
    };
  }

  postTemplate(properties) {
    return getPostTemplate(properties);
  }

  init(Indiekit) {
    this.postTypes = getPostTypes(Indiekit.postTypes);

    Indiekit.addPreset(this);
  }
}
