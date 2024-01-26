const defaults = {
  name: "Video",
  fields: {
    video: { required: true },
    content: {},
    category: {},
    geo: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class PhotoPostType {
  constructor(options = {}) {
    this.name = "Video post type";
    this.options = { ...defaults, ...options };
  }

  get config() {
    return {
      name: this.options.name,
      h: "entry",
      fields: this.options.fields,
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("video", this);
  }
}
