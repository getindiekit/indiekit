import { IndiekitEndpointPlugin } from "@indiekit/plugin";

export default class FrontendEndpointPlugin extends IndiekitEndpointPlugin {
  mountPath = "/frontend";

  name = "Frontend endpoint";

  get routesPublic() {
    this.router.get("/:page", (request, response) => {
      const { page } = request.params;

      response.render(`frontend-${page}`, {
        title: `Frontend ${page}`,
      });
    });

    this.router.post("/form", (request, response) => {
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

    return this.router;
  }
}
