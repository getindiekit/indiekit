import { styles } from "@indiekit/frontend";

export const getStyles = async (request, response) => {
  const css = await styles;
  return response.type("text/css").send(css).end();
};
