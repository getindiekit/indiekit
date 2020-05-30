import Redis from 'ioredis-mock';

export const mockClient = new Redis();
export const expires = 3600;

mockClient.on('error', error => {
  /* c8 ignore next */
  console.error('Redis', error);
});
