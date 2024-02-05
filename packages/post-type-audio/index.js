import { isRequired } from "@indiekit/util";

const defaults = {
  name: "Audio",
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

export default class AudioPostType {
  constructor(options = {}) {
    this.name = "Audio post type";
    this.options = { ...defaults, ...options };
  }

  get config() {
    return {
      name: this.options.name,
      discovery: "audio",
      h: "entry",
      fields: this.options.fields,
    };
  }

  get validationSchemas() {
    return {
      "audio.*": {
        errorMessage: (value, { req }) =>
          req.__(`posts.error.media.empty`, "/music/audio.mp3"),
        exists: { if: (value, { req }) => isRequired(req, "audio") },
        isURL: true,
      },
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("audio", this);
  }
}
