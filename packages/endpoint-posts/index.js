import express from "express";
import { postController } from "./lib/controllers/post.js";
import { postsController } from "./lib/controllers/posts.js";

const defaults = {
  mountPath: "/posts",
};

export const PostsEndpoint = class {
  constructor(options = {}) {
    this.id = "endpoint-posts";
    this.meta = import.meta;
    this.name = "Post management endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  navigationItems(application) {
    if (application.hasDatabase) {
      return {
        href: this.options.mountPath,
        text: "posts.title",
      };
    }
  }

  get routes() {
    const router = this._router;

    router.get("/", postsController);
    router.get("/:id", postController);

    return router;
  }

  init() {
    return true;
  }
};

export default PostsEndpoint;
