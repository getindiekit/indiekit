import Debug from "debug";

const debug = new Debug("indiekit:request");

export const logging = (request, response, next) => {
  debug("url", request.originalUrl);
  debug("headers", request.headers);
  debug("body", request.body);

  next();
};
