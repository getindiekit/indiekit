import Debug from 'debug';

const debug = new Debug('indiekit:request');

export const logging = (request, response, next) => {
  debug('url', request.originalUrl);
  debug('headers', request.headers);
  if (request.is('json')) {
    debug('body (JSON)', JSON.stringify(request.body));
  } else {
    debug('body', request.body);
  }

  next();
};
