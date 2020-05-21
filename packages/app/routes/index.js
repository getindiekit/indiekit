import express from 'express';
import {router as micropubRoute} from './micropub.js';
import {router as settingsRoute} from './settings.js';

export const app = express();

app.use('/micropub', micropubRoute);
app.use('/settings', settingsRoute);
