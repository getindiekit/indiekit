import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";

export default class JekyllPreset {
  constructor() {
    this.id = "jekyll";
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
    const { publication } = Indiekit.config;
    this.postTypes = getPostTypes(publication.postTypes);

    Indiekit.addPreset(this);
  }
}
