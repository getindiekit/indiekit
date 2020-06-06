import fs from 'fs';
import {templates} from '@indiekit/frontend';
import {documentPath} from '../services/documentation.js';

export const viewDocument = (request, response, next) => {
  const filePath = documentPath(request.originalUrl, 'md');

  if (fs.existsSync(filePath)) {
    // Read file
    const string = fs.readFileSync(filePath, 'utf8');

    // Render document variables
    const renderedString = templates().renderString(string, response.locals);

    // Detirmine document title and content
    const firstHeading = renderedString.match(/^(#\s*[\w\s{}.]+\n)/);
    const title = firstHeading[0].replace('# ', '');
    const content = renderedString.replace(firstHeading[0], '');

    // Return document
    response.render('document', {title, content});
  } else {
    next();
  }
};
