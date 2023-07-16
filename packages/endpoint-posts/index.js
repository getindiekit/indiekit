import express from "express";
import { deleteController } from "./lib/controllers/delete.js";
import { formController } from "./lib/controllers/form.js";
import { newController } from "./lib/controllers/new.js";
import { postController } from "./lib/controllers/post.js";
import { postsController } from "./lib/controllers/posts.js";
import { postData } from "./lib/middleware/post-data.js";
import { validate } from "./lib/middleware/validation.js";

const defaults = { mountPath: "/posts" };
const router = express.Router(); // eslint-disable-line new-cap

export default class PostsEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-posts";
    this.meta = import.meta;
    this.name = "Post management endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get navigationItems() {
    return {
      href: this.options.mountPath,
      text: "posts.title",
      requiresDatabase: true,
    };
  }

  get routes() {
    router.get("/", postsController);

    router.get("/new", newController.get);
    router.post("/new", newController.post);

    router.get("/create", postData.create, formController.get);
    router.post("/create", postData.create, validate, formController.post);

    router.use("/:id/:action?", postData.read);
    router.get("/:id", postController);

    router.get("/:id/update", formController.get);
    router.post("/:id/update", validate, formController.post);

    router.get("/:id/:action(delete|undelete)", deleteController.get);
    router.post("/:id/:action(delete|undelete)", deleteController.post);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.postsEndpoint = this.mountPath;
    Indiekit.config.application.supportedPostTypes = [
      "article",
      "note",
      "bookmark",
      "reply",
      "like",
      "rsvp",
      "repost",
    ];
  }
}
