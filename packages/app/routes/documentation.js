import express from 'express';
import * as documentation from '../controllers/documentation.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/*', documentation.viewDocument);

export const documentationRoutes = router;
