import { IndiekitPresetPlugin } from "@indiekit/plugin";

import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";

const defaults = {
  frontMatterFormat: "yaml",
};

export default class HugoPresetPlugin extends IndiekitPresetPlugin {
  info = {
    name: "Hugo",
  };

  name = "Hugo preset";

  /**
   * @type {import('prompts').PromptObject[]}
   */
  prompts = [
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

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.frontMatterFormat] - Front matter format
   */
  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };
  }

  get postTypes() {
    return getPostTypes(this.indiekit.postTypes);
  }

  postTemplate(properties) {
    return getPostTemplate(properties, this.options.frontMatterFormat);
  }
}
