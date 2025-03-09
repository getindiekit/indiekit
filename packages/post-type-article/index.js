import { IndiekitPostTypePlugin } from "@indiekit/plugin";

export default class ArticlePostTypePlugin extends IndiekitPostTypePlugin {
  name = "Article post type";

  postType = "article";

  config = {
    name: "Article",
    h: "entry",
    fields: {
      name: { required: true },
      summary: {},
      content: { required: true },
      category: {},
      geo: {},
      "post-status": {},
      published: { required: true },
      visibility: {},
    },
  };
}
