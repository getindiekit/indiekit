export const editShare = (request, response) => {
  const {content, name, url, success} = request.query;

  response.render('share', {
    title: 'Share',
    content,
    name,
    url,
    success,
    minimalui: (request.params.path === 'bookmarklet')
  });
};
