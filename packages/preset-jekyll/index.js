import { IndiekitPresetPlugin } from "@indiekit/plugin";

import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";

export default class JekyllPresetPlugin extends IndiekitPresetPlugin {
  info = {
    name: "Jekyll",
  };

  name = "Jekyll preset";

  get postTypes() {
    return getPostTypes(this.indiekit.postTypes);
  }

  postTemplate(properties) {
    return getPostTemplate(properties);
  }
}
