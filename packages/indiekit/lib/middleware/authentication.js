import {getBearerToken} from '../tokens.js';

export const authenticate = (request, response, next) => {
  try {
    getBearerToken(request);
    return next();
  } catch {
    return response.redirect(`/session/login?redirect=${request.originalUrl}`);
  }
};
