import makeDebug from "debug";

const debug = makeDebug("indiekit:request");

export const logging = (request, response, next) => {
  // Send debug logging output to console.info
  debug.log = console.info.bind(console);

  debug("URL", request.method, request.originalUrl);
  debug("Headers", request.headers);
  debug("Body", request.body);

  next();
};
