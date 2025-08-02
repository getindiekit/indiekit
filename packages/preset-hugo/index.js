import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";

const defaults = {
  frontMatterFormat: "yaml",
};

export default class HugoPreset {
  name = "Hugo preset";

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }

  get info() {
    return {
      name: "Hugo",
    };
  }

  get prompts() {
    return [
      {
        type: "select",
        name: "frontMatterFormat",
        message: "Which front matter format are you using?",
        choices: [
          {
            title: "JSON",
            value: "json",
          },
          {
            title: "TOML",
            value: "toml",
          },
          {
            title: "YAML",
            value: "yaml",
          },
        ],
        initial: 2,
      },
    ];
  }

  postTemplate(properties) {
    return getPostTemplate(properties, this.options.frontMatterFormat);
  }

  init(Indiekit) {
    this.postTypes = getPostTypes(Indiekit.postTypes);

    Indiekit.addPreset(this);
  }
}
