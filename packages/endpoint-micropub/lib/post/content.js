import fs from 'fs';
import camelcaseKeys from 'camelcase-keys';
import {templates} from '../nunjucks.js';

/**
 * Create post content
 *
 * @param {object} postData URL of existing post
 * @param {string} postTemplatePath Path to post template
 * @returns {object} Post data
 */
export const createPostContent = (postData, postTemplatePath) => {
  // Derive properties
  let {properties} = postData.mf2;
  properties = camelcaseKeys(properties);

  // Prepare content
  const template = fs.readFileSync(postTemplatePath, 'utf-8');
  const postContent = templates.renderString(template, properties);

  return postContent;
};
