export const isRequired = (request, field) => {
  const { postTypes } = request.app.locals.publication;
  const postTypeConfig = postTypes[request.body.postType];

  return postTypeConfig["required-properties"].includes(field);
};
