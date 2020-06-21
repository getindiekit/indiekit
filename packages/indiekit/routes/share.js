import express from 'express';
import * as share from '../controllers/share.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/:path?', share.editShare);

export const shareRoutes = router;
