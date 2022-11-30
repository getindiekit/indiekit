import { touchIcon, scripts, styles } from "@indiekit/frontend";

export const getTouchIcon = async (request, response) => {
  const { application } = request.app.locals;
  const png = await touchIcon(application.themeColor);
  return response.type("image/png").send(png).end();
};

export const getScripts = async (request, response) => {
  const js = await scripts();
  return response.type("text/javascript").send(js).end();
};

export const getStyles = async (request, response) => {
  const css = await styles();
  return response.type("text/css").send(css).end();
};
