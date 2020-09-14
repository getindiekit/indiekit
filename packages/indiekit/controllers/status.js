export const viewStatus = (request, response) => {
  return response.render('status', {
    title: response.__('status.title')
  });
};
