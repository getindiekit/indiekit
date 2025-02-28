import { IndiekitPostTypePlugin } from "@indiekit/plugin";

export default class NotePostTypePlugin extends IndiekitPostTypePlugin {
  name = "Note post type";

  postType = "note";

  config = {
    name: "Note",
    h: "entry",
    fields: {
      content: { required: true },
      category: {},
      geo: {},
      "post-status": {},
      published: { required: true },
      visibility: {},
    },
  };
}
