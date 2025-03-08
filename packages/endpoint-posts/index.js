import path from "node:path";

import { tagInputSanitizer } from "@indiekit/frontend";
import { IndiekitEndpointPlugin } from "@indiekit/plugin";
import { ISO_6709_RE, isRequired } from "@indiekit/util";

import { deleteController } from "./lib/controllers/delete.js";
import { formController } from "./lib/controllers/form.js";
import { newController } from "./lib/controllers/new.js";
import { postController } from "./lib/controllers/post.js";
import { postsController } from "./lib/controllers/posts.js";
import { postData } from "./lib/middleware/post-data.js";
import { validate } from "./lib/middleware/validation.js";

const defaults = {
  mountPath: "/posts",
};

export default class PostsEndpointPlugin extends IndiekitEndpointPlugin {
  name = "Post management endpoint";

  validationSchemas = {
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
    "featured.url": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.media.empty`, "/photos/image.jpg"),
      exists: { if: (value, { req }) => isRequired(req, "featured") },
      notEmpty: true,
    },
    "featured.alt": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.featured-alt.empty`),
      exists: { if: (value, { req }) => req.body?.featured.url },
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

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.mountPath] - Path to endpoint
   */
  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };

    this.mountPath = this.options.mountPath;

    this.navigationItems = {
      href: this.mountPath,
      text: "posts.title",
      requiresDatabase: true,
    };

    this.shortcutItems = {
      url: path.join(this.mountPath, "new"),
      name: "posts.create.action",
      iconName: "createPost",
      requiresDatabase: true,
    };
  }

  get routes() {
    this.router.get("/", postsController);

    this.router.get("/new", newController.get);
    this.router.post("/new", validate.new, newController.post);

    this.router.get("/create", postData.create, formController.get);
    this.router.post(
      "/create",
      postData.create,
      validate.form,
      formController.post,
    );

    this.router.use("/:uid{/:action}", postData.read);
    this.router.get("/:uid", postController);

    this.router.get("/:uid/update", formController.get);
    this.router.post("/:uid/update", validate.form, formController.post);

    this.router.get(["/:uid/delete", "/:uid/undelete"], deleteController.get);
    this.router.post(["/:uid/delete", "/:uid/undelete"], deleteController.post);

    return this.router;
  }

  async init() {
    await super.init();

    this.indiekit.config.application.postsEndpoint = this.mountPath;
  }
}
