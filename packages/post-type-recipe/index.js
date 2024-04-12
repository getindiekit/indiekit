const defaults = {
  name: "Recipe",
  fields: {
    name: { required: true },
    summary: {},
    yield: {},
    duration: {},
    ingredient: {},
    instructions: { required: true },
    category: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class RecipePostType {
  constructor(options = {}) {
    this.name = "Recipe post type";
    this.options = { ...defaults, ...options };
  }

  get config() {
    return {
      name: this.options.name,
      discovery: "instructions",
      h: "recipe",
      fields: this.options.fields,
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("recipe", this);
  }
}
