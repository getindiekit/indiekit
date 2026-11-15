import path from "node:path";

import { tagInputSanitizer } from "@indiekit/frontend";
import {
  hasValue,
  ISO_6709_RE,
  isRequiredField,
  localisedMessage,
} from "@indiekit/util";
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
  name = "Post management endpoint";

  constructor(options = {}) {
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

  /**
   * @returns {Schema<keyof ParamSchema|"tagInput">} Validation schemas for fields
   */
  get validationSchemas() {
    return {
      category: {
        exists: { if: hasValue("category") },
        tagInput: tagInputSanitizer,
        isArray: true,
      },
      content: {
        errorMessage: localisedMessage("posts.error.content.empty"),
        exists: { if: isRequiredField("content") },
        notEmpty: true,
      },
      "featured.url": {
        errorMessage: localisedMessage(
          "posts.error.media.empty",
          "/photos/image.jpg",
        ),
        exists: { if: isRequiredField("featured") },
        notEmpty: true,
      },
      "featured.alt": {
        errorMessage: localisedMessage("posts.error.featured-alt.empty"),
        exists: { if: hasValue("featured.url") },
        notEmpty: true,
      },
      geo: {
        errorMessage: localisedMessage("posts.error.geo.invalid"),
        exists: { if: hasValue("geo") },
        custom: {
          options: /** @type {CustomValidator} */ (
            (value) => value.match(ISO_6709_RE)
          ),
        },
      },
      name: {
        errorMessage: localisedMessage("posts.error.name.empty"),
        exists: { if: isRequiredField("name") },
        notEmpty: true,
      },
    };
  }

  /**
   * @param {IndiekitInstance} Indiekit - Indiekit instance
   */
  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.addPostType(false, this);
    Indiekit.config.application.postsEndpoint = this.mountPath;
  }
}

/**
 * @import { CustomValidator, ParamSchema, Schema } from "express-validator"
 */
