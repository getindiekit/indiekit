import fs from 'fs';
import {templates} from '@indiekit/frontend';
import {documentPath} from '../lib/documentation.js';

export const viewDocument = (request, response, next) => {
  // Localised URL and file path
  const {originalUrl} = request;
  const filePath = documentPath(originalUrl, 'md');

  // English URL and file path
  const pagePath = request.params[0] ? request.params[0] : '';
  const englishUrl = `/docs/en/${pagePath}`;
  const englishFilePath = documentPath(englishUrl, 'md');

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
  } else if (fs.existsSync(englishFilePath)) {
    response.redirect(englishUrl);
  } else {
    next();
  }
};
