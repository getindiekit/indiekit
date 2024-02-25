import express from "express";

const defaults = {
  mountPath: "/frontend",
};

// eslint-disable-next-line new-cap
const router = express.Router({ caseSensitive: true, mergeParams: true });

export default class FrontendEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-frontend";
    this.name = "Frontend endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get routesPublic() {
    router.get("/:page", (request, response) => {
      const { page } = request.params;

      response.render(`frontend-${page}`, {
        title: `Frontend ${page}`,
      });
    });

    router.post("/form", (request, response) => {
      response.render(`frontend-form`, {
        title: `Frontend form (with errors)`,
        errors: {
          content: {
            msg: "Input error",
            param: "input",
          },
        },
      });
    });

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
  }
}
