import fs from 'fs';
import camelcaseKeys from 'camelcase-keys';
import {templates} from '../nunjucks.js';

export const createPostContent = (postData, postTemplatePath) => {
  try {
    // Derive properties
    let {properties} = postData.mf2;
    properties = camelcaseKeys(properties);

    // Prepare content
    const template = fs.readFileSync(postTemplatePath, 'utf-8');
    const postContent = templates.renderString(template, properties);

    return postContent;
  } catch (error) {
    throw new Error(error.message);
  }
};
