import express from "express";
import { deleteController } from "./lib/controllers/delete.js";
import { postController } from "./lib/controllers/post.js";
import { postsController } from "./lib/controllers/posts.js";

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
    router.get("/:id", postController);
    router.get("/:id/delete", deleteController.get);
    router.post("/:id/delete", deleteController.post);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.postsEndpoint = this.mountPath;
  }
}
