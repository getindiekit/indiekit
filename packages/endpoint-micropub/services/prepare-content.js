import fs from 'fs/promises';
import nunjucks from 'nunjucks';

/**
 * Prepare post type template.
 *
 * @param {object} properties Microformats 2 properties
 * @param {string} templatePath Path to post type template
 * @returns {string} Micropub action
 */
export const prepareContent = async (properties, templatePath) => {
  const template = await fs.readFile(templatePath, 'utf8');
  const content = nunjucks.renderString(template, properties);
  return content;
};
