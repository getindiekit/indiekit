import express from 'express';
import {query} from '@indiekit/endpoint-micropub';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/micropub', query);

export const endpointRoutes = router;
