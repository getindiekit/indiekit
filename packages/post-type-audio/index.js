import { isRequiredField, localisedMessage } from "@indiekit/util";

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
  name = "Audio post type";

  constructor(options = {}) {
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
        errorMessage: localisedMessage(
          "posts.error.media.empty",
          "/music/audio.mp3",
        ),
        exists: { if: isRequiredField("audio") },
        notEmpty: true,
      },
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("audio", this);
  }
}
