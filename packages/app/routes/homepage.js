import express from 'express';
import * as homepage from '../controllers/homepage.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', homepage.viewHomepage);

export const homepageRoutes = router;
