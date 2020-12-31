export const publication = {
  micropubEndpoint: '/micropub',
  posts: {
    find: () => ({
      toArray: async () => ([])
    })
  },
  syndicationTargets: [{
    name: 'Example social network',
    uid: 'https://social.example/'
  }]
};
