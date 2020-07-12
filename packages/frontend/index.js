import {fileURLToPath} from 'url';
import path from 'path';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const assetsPath = `${__dirname}/assets`;
export {templates} from './lib/nunjucks.js';
export {styles} from './lib/postcss.js';
