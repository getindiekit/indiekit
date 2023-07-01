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

// eslint-disable-next-line new-cap
const router = express.Router({ caseSensitive: true, mergeParams: true });

export default class AuthorizationEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-auth";
    this.meta = import.meta;
    this.name = "IndieAuth endpoint";
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
    router.post("/token", codeValidator, tokenController.post);

    // Verification
    router.post("/introspect", introspectionController.post);

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

    // Use private value to register IndieAuth authorization endpoint path
    Indiekit.config.application._authorizationEndpointPath =
      this.options.mountPath;

    // Use private value to register IndieAuth introspection endpoint path
    Indiekit.config.application._introspectionEndpointPath =
      this.options.mountPath + "/introspect";

    // Use private value to register IndieAuth token endpoint path
    Indiekit.config.application._tokenEndpointPath =
      this.options.mountPath + "/token";
  }
}
