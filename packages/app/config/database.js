import Redis from 'ioredis';

export const client = new Redis(process.env.REDIS_URL);
export const expires = 3600;

client.on('error', error => {
  /* c8 ignore next */
  console.error('Redis', error);
});
