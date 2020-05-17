import got from 'got';
import {client} from '../config/app.js';

export default async (key, url, expires = 3600) => {
  const cachedData = await client.get(key);

  if (cachedData) {
    return {
      source: 'cache',
      data: JSON.parse(cachedData)
    };
  }

  // Fetch data from remote URL
  const fetchedData = await got(url).json();

  // Save response to Redis store
  client.setex(key, expires, JSON.stringify(fetchedData));

  // Return JSON response
  return {
    source: 'fetch',
    data: fetchedData
  };
};
