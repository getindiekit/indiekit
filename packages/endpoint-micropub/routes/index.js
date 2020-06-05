import express from 'express';
import query from '../controllers/query.js';
import {createPost} from '../controllers/post.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', query);
router.post('/', createPost);

export const micropubRoutes = router;
