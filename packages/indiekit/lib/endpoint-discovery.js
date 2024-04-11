export const discoverEndpoints = (url) => {
  console.log(url);
  return {
    authorizationEndpoint: "https://micro.blog/indieauth/auth",
    tokenEndpoint: "https://micro.blog/indieauth/token",
  };
};
