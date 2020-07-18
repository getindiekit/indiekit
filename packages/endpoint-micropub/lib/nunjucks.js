import nunjucks from 'nunjucks';

/**
 * @returns {object} Nunjucks environment
 */
export const templates = (() => {
  const views = [];

  const options = {
    autoescape: true
  };

  const parser = nunjucks.configure(views, options);

  return parser;
})();
