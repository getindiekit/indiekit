import path from "node:path";

import { getPackageData } from "../utils.js";

export const list = (request, response) => {
  const { installedPlugins } = response.app.locals;

  const plugins = [...installedPlugins].map((plugin) => {
    const _package = getPackageData(plugin.filePath);

    plugin.photo = {
      srcOnError: "/assets/plug-in.svg",
      attributes: { height: 96, width: 96 },
      url: `/assets/${plugin.id}/icon.svg`,
    };
    plugin.title = plugin.name;
    plugin.description = { text: _package.description };
    plugin.url = `/plugins/${plugin.id}`;

    return plugin;
  });

  response.render("plugins/list", {
    parent: {
      href: "/status/",
      text: response.locals.__("status.title"),
    },
    title: response.locals.__("status.application.installedPlugins"),
    plugins,
  });
};

export const view = (request, response) => {
  const { installedPlugins } = response.app.locals;
  const { pluginId } = request.params;

  const plugin = [...installedPlugins].find((plugin) => plugin.id === pluginId);
  plugin.package = getPackageData(plugin.filePath);

  response.render("plugins/view", {
    parent: {
      href: path.dirname(request.path),
      text: response.locals.__("status.application.installedPlugins"),
    },
    title: plugin.name,
    photo: {
      src: `/assets/${plugin.id}/icon.svg`,
      srcOnError: `/assets/plug-in.svg`,
    },
    plugin,
  });
};
