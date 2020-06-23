import fs from 'fs';
import {templates} from '../nunjucks.js';

export const createPostContent = (postData, postTemplatePath) => {
  try {
    // Derive properties
    const {properties} = postData.mf2;

    // Prepare content
    const template = fs.readFileSync(postTemplatePath, 'utf-8');
    const postContent = templates.renderString(template, properties);

    return postContent;
  } catch (error) {
    throw new Error(error.message);
  }
};
