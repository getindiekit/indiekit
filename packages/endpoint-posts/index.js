import path from "node:path";

import { tagInputSanitizer } from "@indiekit/frontend";
import { ISO_6709_RE, isRequired } from "@indiekit/util";
import express from "express";

import { deleteController } from "./lib/controllers/delete.js";
import { formController } from "./lib/controllers/form.js";
import { newController } from "./lib/controllers/new.js";
import { postController } from "./lib/controllers/post.js";
import { postsController } from "./lib/controllers/posts.js";
import { postData } from "./lib/middleware/post-data.js";
import { validate } from "./lib/middleware/validation.js";

const defaults = { mountPath: "/posts" };
const router = express.Router();

export default class PostsEndpoint {
  constructor(options = {}) {
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

  get shortcutItems() {
    return {
      url: path.join(this.options.mountPath, "new"),
      name: "posts.create.action",
      iconName: "createPost",
      requiresDatabase: true,
    };
  }

  get routes() {
    router.get("/", postsController);

    router.get("/new", newController.get);
    router.post("/new", validate.new, newController.post);

    router.get("/create", postData.create, formController.get);
    router.post("/create", postData.create, validate.form, formController.post);

    router.use("/:uid{/:action}", postData.read);
    router.get("/:uid", postController);

    router.get("/:uid/update", formController.get);
    router.post("/:uid/update", validate.form, formController.post);

    router.get(["/:uid/delete", "/:uid/undelete"], deleteController.get);
    router.post(["/:uid/delete", "/:uid/undelete"], deleteController.post);

    return router;
  }

  get validationSchemas() {
    return {
      category: {
        exists: { if: (value, { req }) => req.body?.category },
        tagInput: tagInputSanitizer,
        isArray: true,
      },
      content: {
        errorMessage: (value, { req }) => req.__("posts.error.content.empty"),
        exists: { if: (value, { req }) => isRequired(req, "content") },
        notEmpty: true,
      },
      geo: {
        errorMessage: (value, { req }) => req.__(`posts.error.geo.invalid`),
        exists: { if: (value, { req }) => req.body?.geo },
        custom: {
          options: (value) => value.match(ISO_6709_RE),
        },
      },
      name: {
        errorMessage: (value, { req }) => req.__("posts.error.name.empty"),
        exists: { if: (value, { req }) => isRequired(req, "name") },
        notEmpty: true,
      },
    };
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.addPostType(false, this);
    Indiekit.config.application.postsEndpoint = this.mountPath;
  }
}
