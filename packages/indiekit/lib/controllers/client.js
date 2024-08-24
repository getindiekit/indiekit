export const get = async (request, response) => {
  const { name: client_name, url: client_uri } = request.app.locals.application;
  const { href: client_id } = new URL("id", client_uri);
  const { href: logo_uri } = new URL("assets/app-icon-512-any.png", client_uri);

  response.set("Cache-Control", "public, max-age=604800"); // 7 days
  return response.type("application/json").json({
    client_id,
    client_name,
    client_uri,
    logo_uri,
  });
};
