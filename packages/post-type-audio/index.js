import { IndiekitPostTypePlugin } from "@indiekit/plugin";
import { isRequired } from "@indiekit/util";

export default class AudioPostTypePlugin extends IndiekitPostTypePlugin {
  name = "Audio post type";

  postType = "audio";

  config = {
    name: "Audio",
    discovery: "audio",
    h: "entry",
    fields: {
      audio: { required: true },
      content: {},
      category: {},
      geo: {},
      "post-status": {},
      published: { required: true },
      visibility: {},
    },
  };

  validationSchemas = {
    "audio.*": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.media.empty`, "/music/audio.mp3"),
      exists: { if: (value, { req }) => isRequired(req, "audio") },
      notEmpty: true,
    },
  };
}
