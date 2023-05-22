import makeDebug from "debug";

const debug = makeDebug("indiekit:request");

export const logging = (request, response, next) => {
  // Send debug logging output to console.info
  debug.log = console.info.bind(console);

  debug("url", request.method, request.originalUrl);
  debug("headers", request.headers);
  debug("body", request.body);

  next();
};
