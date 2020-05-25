import express from 'express';
import assetsRoute from './assets.js';
import documentationRoute from './documentation.js';
import micropubRoute from './micropub.js';
import settingsRoute from './settings.js';
import signInRoute from './sign-in.js';
import errorRoute from './error.js';

const router = express.Router(); // eslint-disable-line new-cap

// Attach routes to router
assetsRoute(router);
documentationRoute(router);
micropubRoute(router);
settingsRoute(router);
signInRoute(router);
errorRoute(router);

export default router;
