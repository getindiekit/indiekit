import {fileURLToPath} from 'url';
import path from 'path';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export {default as templates} from './lib/nunjucks.js';
export {default as styles} from './lib/postcss.js';
