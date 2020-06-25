import Redis from 'ioredis';

export const databaseConfig = (() => {
  try {
    return {
      client: new Redis(process.env.REDIS_URL, {
        showFriendlyErrorStack: process.env.NODE_ENV === 'development'
      }),
      expires: 3600
    };
  } catch (error) {
    throw new Error(error.message);
  }
})();
