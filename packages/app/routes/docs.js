import fs from 'fs';
import express from 'express';
import {templates} from '../../frontend/index.js';
import documentPath from '../services/document-path.js';

export const router = express.Router(); // eslint-disable-line new-cap

router.get('/*', (request, response, next) => {
  try {
    // Read file
    const file = documentPath(request.originalUrl, 'md');
    const string = fs.readFileSync(file, 'utf8');

    // Render document variables
    const renderedString = templates().renderString(string, response.locals);

    // Detirmine document title and content
    const firstHeading = renderedString.match(/^(#\s*[\w\s{}.]+\n)/);
    const title = firstHeading[0].replace('# ', '');
    const content = renderedString.replace(firstHeading[0], '');

    // Return document
    response.render('document', {title, content});
  } catch {
    next();
  }
});
