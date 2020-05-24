import rewiremock from 'rewiremock/node.js';

rewiremock('ioredis')
  .by('ioredis-mock');

export {rewiremock};
