export const viewStatus = (request, response) => {
  return response.render('status', {
    title: 'Server status'
  });
};
