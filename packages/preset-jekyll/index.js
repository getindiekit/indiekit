import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";

export default class JekyllPreset {
  name = "Jekyll preset";

  get info() {
    return {
      name: "Jekyll",
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
