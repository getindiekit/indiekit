const defaults = {
  name: "Jam",
  fields: {
    "jam-of": { required: true },
    content: {},
    "post-status": {},
    published: { required: true },
  },
};

export default class JamPostType {
  constructor(options = {}) {
    this.name = "Jam post type";
    this.options = { ...defaults, ...options };
  }

  get config() {
    return {
      name: this.options.name,
      h: "entry",
      discovery: "jam-of",
      fields: this.options.fields,
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("jam", this);
  }
}
