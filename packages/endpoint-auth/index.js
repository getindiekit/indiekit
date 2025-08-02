import express from "express";

import { authorizationController } from "./lib/controllers/authorization.js";
import { consentController } from "./lib/controllers/consent.js";
import { documentationController } from "./lib/controllers/documentation.js";
import { introspectionController } from "./lib/controllers/introspection.js";
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

const router = express.Router({ caseSensitive: true, mergeParams: true });

export default class AuthorizationEndpoint {
  name = "IndieAuth endpoint";

  constructor(options = {}) {
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
    router.get("/token", introspectionController.post);
    router.post("/token", codeValidator, tokenController.post);

    // Verification
    router.post("/introspect", introspectionController.post);

    // Metadata
    router.get("/metadata", metadataController);

    return router;
  }

  get routesWellKnown() {
    router.get("/change-password", (request, response) =>
      response.redirect(`${this.mountPath}/new-password`),
    );
    router.get("/oauth-authorization-server", metadataController);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);

    // Only mount if authorization endpoint not already configured
    if (!Indiekit.config.application.authorizationEndpoint) {
      Indiekit.config.application.authorizationEndpoint = this.mountPath;
    }

    // Only mount if introspection endpoint not already configured
    if (!Indiekit.config.application.introspectionEndpoint) {
      Indiekit.config.application.introspectionEndpoint = `${this.mountPath}/introspect`;
    }

    // Only mount if token endpoint not already configured
    if (!Indiekit.config.application.tokenEndpoint) {
      Indiekit.config.application.tokenEndpoint = `${this.mountPath}/token`;
    }
  }
}
