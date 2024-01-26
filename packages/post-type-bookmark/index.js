const defaults = {
  name: "Bookmark",
  fields: {
    "bookmark-of": { required: true },
    name: {},
    content: {},
    category: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class BookmarkPostType {
  constructor(options = {}) {
    this.name = "Bookmark post type";
    this.options = { ...defaults, ...options };
  }

  get config() {
    return {
      name: this.options.name,
      discovery: "bookmark-of",
      h: "entry",
      fields: this.options.fields,
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("bookmark", this);
  }
}
