import Redis from 'ioredis';

export const databaseConfig = (() => {
  return {
    client: new Redis(process.env.REDIS_URL, {
      showFriendlyErrorStack: process.env.NODE_ENV === 'development'
    }),
    expires: 3600
  };
})();
