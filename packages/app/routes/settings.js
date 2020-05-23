import express from 'express';
import {read as settings} from '../controllers/settings.js';

export const router = express.Router(); // eslint-disable-line new-cap

router.get('/', async (request, response) => {
  response.render('settings/index', {
    title: 'Settings',
    app: await settings
  });
});
