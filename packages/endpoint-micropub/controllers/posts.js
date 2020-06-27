export const postsController = publication => ({
  view: async (request, response, next) => {
    try {
      const posts = await publication.posts.selectFromAll('mf2');

      response.render('posts', {
        title: 'Posts',
        posts
      });
    } catch (error) {
      next(error);
    }
  }
});
