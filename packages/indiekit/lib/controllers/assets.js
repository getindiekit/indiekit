import { appIcon, scripts, styles } from "@indiekit/frontend";

export const getAppIcon = (size) => {
  return async (request, response) => {
    const { application } = request.app.locals;
    const png = await appIcon(application.themeColor, size);
    return response.type("image/png").send(png).end();
  };
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
