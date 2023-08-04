import path from "node:path";
import { getPackageData } from "../utils.js";

export const list = (request, response) => {
  const { application } = response.app.locals;

  const plugins = application.installedPlugins.map((plugin) => {
    const _package = plugin.meta ? getPackageData(plugin.meta.url) : {};
    plugin.photo = {
      srcOnError: "/assets/plug-in.svg",
      attributes: { height: 96, width: 96 },
      url: `/assets/${plugin.id}/icon.svg`,
    };
    plugin.title = plugin.name;
    plugin.description = _package.description;
    plugin.url = `/plugins/${plugin.id}`;

    return plugin;
  });

  response.render("plugins/list", {
    parent: {
      href: "/status/",
      text: request.__("status.title"),
    },
    title: request.__("status.application.installedPlugins"),
    plugins,
  });
};

export const view = (request, response) => {
  const { application } = response.app.locals;
  const { pluginId } = request.params;

  const plugin = application.installedPlugins.find(
    (plugin) => plugin.id === pluginId,
  );
  plugin.package = getPackageData(plugin.meta.url);

  response.render("plugins/view", {
    parent: {
      href: path.dirname(request.path),
      text: request.__("status.application.installedPlugins"),
    },
    title: plugin.name,
    photo: {
      src: `/assets/${plugin.id}/icon.svg`,
      srcOnError: `/assets/plug-in.svg`,
    },
    plugin,
  });
};
