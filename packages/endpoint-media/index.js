import deepmerge from "deepmerge";
import express from "express";

import { actionController } from "./lib/controllers/action.js";
import { queryController } from "./lib/controllers/query.js";

const defaults = {
  imageProcessing: {
    resize: {
      fit: "outside",
      withoutEnlargement: true,
    },
  },
  mountPath: "/media",
};
const router = express.Router();

export default class MediaEndpoint {
  name = "Micropub media endpoint";

  constructor(options = {}) {
    this.options = deepmerge(defaults, options);
    this.mountPath = this.options.mountPath;
  }

  get routes() {
    router.get("/", queryController);
    router.post("/", actionController(this.options.imageProcessing));

    return router;
  }

  init(Indiekit) {
    // Every paginated query sorts and ranges on `properties.uid`, and MongoDB
    // abandons an unindexed sort once it needs more than 32MB
    Indiekit.addCollection("media", [{ key: { "properties.uid": 1 } }]);
    Indiekit.addEndpoint(this);

    // Only mount if media endpoint not already configured
    if (!Indiekit.config.application.mediaEndpoint) {
      Indiekit.config.application.mediaEndpoint = this.mountPath;
    }
  }
}
