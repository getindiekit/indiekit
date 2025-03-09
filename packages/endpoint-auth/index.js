import { IndiekitEndpointPlugin } from "@indiekit/plugin";

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

export default class AuthorizationEndpointPlugin extends IndiekitEndpointPlugin {
  name = "IndieAuth endpoint";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.mountPath] - Path to endpoint
   */
  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };

    this.mountPath = this.options.mountPath;
  }

  get routesPublic() {
    this.router.use(hasSecret);

    // Authorization
    this.router.get("/", authorizationController.get, documentationController);
    this.router.post("/", codeValidator, authorizationController.post);
    this.router.get("/consent", consentController.get);
    this.router.post("/consent", consentValidator, consentController.post);
    this.router.get("/new-password", passwordController.get);
    this.router.post(
      "/new-password",
      passwordValidator,
      passwordController.post,
    );

    // Authentication
    this.router.get("/token", introspectionController.post);
    this.router.post("/token", codeValidator, tokenController.post);

    // Verification
    this.router.post("/introspect", introspectionController.post);

    // Metadata
    this.router.get("/metadata", metadataController);

    return this.router;
  }

  get routesWellKnown() {
    this.router.get("/change-password", (request, response) =>
      response.redirect(`${this.mountPath}/new-password`),
    );
    this.router.get("/oauth-authorization-server", metadataController);

    return this.router;
  }

  async init() {
    await super.init();

    const { application } = this.indiekit.config;

    // Only mount if authorization endpoint not already configured
    if (!application.authorizationEndpoint) {
      application.authorizationEndpoint = this.mountPath;
    }

    // Only mount if introspection endpoint not already configured
    if (!application.introspectionEndpoint) {
      application.introspectionEndpoint = `${this.mountPath}/introspect`;
    }

    // Only mount if token endpoint not already configured
    if (!application.tokenEndpoint) {
      application.tokenEndpoint = `${this.mountPath}/token`;
    }
  }
}
