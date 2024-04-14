import { appIcon, shortcutIcon, scripts, styles } from "@indiekit/frontend";

export const getAppIcon = async (request, response, next) => {
  const { purpose, size } = request.params;
  const { themeColor } = request.app.locals.application;

  try {
    const png = await appIcon(size, themeColor, purpose);
    return response.type("image/png").send(png).end();
  } catch {
    next();
  }
};

export const getShortcutIcon = async (request, response, next) => {
  const { name, size } = request.params;

  try {
    const png = await shortcutIcon(size, name);
    return response.type("image/png").send(png).end();
  } catch {
    next();
  }
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
