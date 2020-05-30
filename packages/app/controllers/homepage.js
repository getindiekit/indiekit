export const viewHomepage = (request, response) => {
  return response.render('homepage', {
    title: 'Status'
  });
};
