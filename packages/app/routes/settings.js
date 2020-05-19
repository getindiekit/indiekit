import express from 'express';
import {read} from '../controllers/settings.js';

export const router = express.Router(); // eslint-disable-line new-cap

router.get('/', async (request, response) => {
  const settings = await read();
  response.json(settings);
});
