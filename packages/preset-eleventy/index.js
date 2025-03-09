import { IndiekitPresetPlugin } from "@indiekit/plugin";

import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";

export default class EleventyPresetPlugin extends IndiekitPresetPlugin {
  info = {
    name: "Eleventy",
  };

  name = "Eleventy preset";

  get postTypes() {
    return getPostTypes(this.indiekit.postTypes);
  }

  postTemplate(properties) {
    return getPostTemplate(properties);
  }
}
