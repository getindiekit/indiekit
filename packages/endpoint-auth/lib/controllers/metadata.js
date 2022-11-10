/* eslint-disable camelcase */
import { scopes } from "../scope.js";

export const metadataController = (request, response) => {
  const { application, publication } = request.app.locals;

  const metadata = {
    issuer: application.url,
    authorization_endpoint: publication.authorizationEndpoint,
    token_endpoint: publication.tokenEndpoint,
    code_challenge_methods_supported: ["S256"],
    response_types_supported: ["code"],
    scopes_supported: scopes,
    service_documentation: publication.authorizationEndpoint,
    ui_locales_supported: application.localeUsed,
  };

  return response.json(metadata);
};
