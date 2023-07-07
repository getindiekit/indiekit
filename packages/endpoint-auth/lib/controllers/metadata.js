import { scopes } from "../scope.js";

export const metadataController = (request, response) => {
  const { application } = request.app.locals;

  const metadata = {
    issuer: application.url,
    authorization_endpoint: application.authorizationEndpoint,
    introspection_endpoint: application.introspectionEndpoint,
    token_endpoint: application.tokenEndpoint,
    code_challenge_methods_supported: ["S256"],
    response_types_supported: ["code"],
    scopes_supported: scopes,
    service_documentation: application.authorizationEndpoint,
    ui_locales_supported: application.localeUsed,
  };

  return response.json(metadata);
};
