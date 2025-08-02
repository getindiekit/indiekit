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
  name = "Note post type";

  constructor(options = {}) {
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
    Indiekit.addPostType("note", this);
  }
}
