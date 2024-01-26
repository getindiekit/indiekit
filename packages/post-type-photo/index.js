const defaults = {
  name: "Photo",
  fields: {
    photo: { required: true },
    content: {},
    category: {},
    geo: {},
    "post-status": {},
    "mp-photo-alt": { required: true },
    published: { required: true },
    visibility: {},
  },
};

export default class PhotoPostType {
  constructor(options = {}) {
    this.name = "Photo post type";
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
    Indiekit.addPostType("photo", this);
  }
}
