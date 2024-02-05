import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";

export default class JekyllPreset {
  constructor() {
    this.name = "Jekyll preset";
  }

  get info() {
    return {
      name: "Jekyll",
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
