import Redis from 'ioredis';

export const databaseConfig = {
  client: new Redis(process.env.REDIS_URL),
  expires: 3600
};
