import { appIcon, scripts, styles } from "@indiekit/frontend";

export const getAppIcon = async (request, response) => {
  const { size } = request.params;
  const { themeColor } = request.app.locals.application;
  const png = await appIcon(themeColor, Number(size));
  return response.type("image/png").send(png).end();
};

export const getScripts = async (request, response) => {
  const js = await scripts();

  response.set("Cache-Control", "max-age=2147483648, immutable");
  return response.type("text/javascript").send(js).end();
};

export const getStyles = async (request, response) => {
  const css = await styles();

  response.set("Cache-Control", "max-age=2147483648, immutable");
  return response.type("text/css").send(css).end();
};
