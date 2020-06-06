import query from '../controllers/query.js';
import {Post} from '../controllers/post.js';

export const micropubRoutes = (router, publisher) => {
  const post = new Post(publisher);

  router.get('/', query);
  router.post('/', post.create);
};
