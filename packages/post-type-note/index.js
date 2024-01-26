const defaults = {
  name: "Note",
  fields: {
    content: { required: true },
    category: {},
    geo: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class NotePostType {
  constructor(options = {}) {
    this.name = "Note post type";
    this.options = { ...defaults, ...options };
  }

  get config() {
    return {
      name: this.options.name,
      h: "entry",
      fields: this.options.fields,
      requiredFields: ["content", "published"],
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("note", this);
  }
}
