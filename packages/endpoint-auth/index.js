import express from "express";
import { authorizationController } from "./lib/controllers/authorization.js";
import { documentationController } from "./lib/controllers/documentation.js";
import { consentController } from "./lib/controllers/consent.js";
import { metadataController } from "./lib/controllers/metadata.js";
import { passwordController } from "./lib/controllers/password.js";
import { tokenController } from "./lib/controllers/token.js";
import { codeValidator } from "./lib/middleware/code.js";
import { hasSecret } from "./lib/middleware/secret.js";
import {
  consentValidator,
  passwordValidator,
} from "./lib/middleware/validation.js";

const defaults = {
  mountPath: "/auth",
};

// eslint-disable-next-line new-cap
const router = express.Router({ caseSensitive: true, mergeParams: true });

export default class AuthorizationEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-auth";
    this.meta = import.meta;
    this.name = "Authentication and authorization endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get routesPublic() {
    router.use(hasSecret);

    // Authorization
    router.get("/", authorizationController.get, documentationController);
    router.post("/", codeValidator, authorizationController.post);
    router.get("/consent", consentController.get);
    router.post("/consent", consentValidator, consentController.post);
    router.get("/new-password", passwordController.get);
    router.post("/new-password", passwordValidator, passwordController.post);

    // Authentication
    router.get("/token", tokenController.get, documentationController);
    router.post("/token", codeValidator, tokenController.post);

    // Metadata
    router.get("/metadata", metadataController);

    return router;
  }

  get routesWellKnown() {
    router.get("/change-password", (request, response) =>
      response.redirect(`${this.options.mountPath}/new-password`)
    );
    router.get("/oauth-authorization-server", metadataController);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.authorizationEndpoint = this.options.mountPath;
    Indiekit.config.application.tokenEndpoint =
      this.options.mountPath + "/token";
  }
}
