import { IndiekitPostTypePlugin } from "@indiekit/plugin";
import { isRequired } from "@indiekit/util";

export default class VideoPostTypePlugin extends IndiekitPostTypePlugin {
  name = "Video post type";

  postType = "video";

  config = {
    name: "Video",
    h: "entry",
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

  validationSchemas = {
    "video.*": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.media.empty`, "/movies/video.mp4"),
      exists: { if: (value, { req }) => isRequired(req, "video") },
      notEmpty: true,
    },
  };
}
