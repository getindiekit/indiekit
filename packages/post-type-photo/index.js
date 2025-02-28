import { IndiekitPostTypePlugin } from "@indiekit/plugin";
import { isRequired } from "@indiekit/util";

export default class PhotoPostTypePlugin extends IndiekitPostTypePlugin {
  name = "Photo post type";

  postType = "photo";

  config = {
    name: "Photo",
    h: "entry",
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

  validationSchemas = {
    "photo.*.url": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.media.empty`, "/photos/image.jpg"),
      exists: { if: (value, { req }) => isRequired(req, "photo") },
      notEmpty: true,
    },
    "photo.*.alt": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.mp-photo-alt.empty`),
      exists: { if: (value, { req }) => isRequired(req, "mp-photo-alt") },
      notEmpty: true,
    },
  };
}
