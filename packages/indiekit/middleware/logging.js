import Debug from 'debug';

export const logging = (request, response, next) => {
  const debug = new Debug('indiekit:request');
  debug('headers', request.headers);
  debug('body', request.body);

  next();
};
