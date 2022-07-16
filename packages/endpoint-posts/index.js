import express from "express";
import { postController } from "./lib/controllers/post.js";
import { postsController } from "./lib/controllers/posts.js";

const defaults = {
  mountPath: "/posts",
};

export default class PostsEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-posts";
    this.meta = import.meta;
    this.name = "Post management endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get navigationItems() {
    return {
      href: this.options.mountPath,
      text: "posts.title",
      requiresDatabase: true,
    };
  }

  get routes() {
    const router = this._router;

    router.get("/", postsController);
    router.get("/:id", postController);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
  }
}
