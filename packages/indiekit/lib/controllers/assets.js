import frontend from "@indiekit/frontend";

const { styles } = frontend;

export const getStyles = async (request, response) => {
  const css = await styles;
  return response.type("text/css").send(css).end();
};
