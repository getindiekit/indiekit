import express from 'express';
import * as homepageController from '../controllers/homepage.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', homepageController.viewHomepage);

export const homepageRoutes = router;
