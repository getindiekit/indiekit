import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";

export default class EleventyPreset {
  constructor() {
    this.name = "Eleventy preset";
  }

  get info() {
    return {
      name: "Eleventy",
    };
  }

  postTemplate(properties) {
    return getPostTemplate(properties);
  }

  init(Indiekit) {
    const { application } = Indiekit.config;
    this.postTypes = getPostTypes(application.postTypes);

    Indiekit.addPreset(this);
  }
}
