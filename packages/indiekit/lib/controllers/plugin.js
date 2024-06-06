import path from "node:path";
import makeDebug from "debug";
import { getPackageData } from "../utils.js";

const debug = makeDebug(`indiekit:controllers:plugin`);

export const list = (request, response) => {
  const { application } = response.app.locals;

  const plugins = application.installedPlugins.map((plugin) => {
    const _package = getPackageData(plugin.filePath);
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

  debug(`render view plugins/list (${plugins.length} plugins)`);
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
  const { application } = response.app.locals;
  const { pluginId } = request.params;
  debug(`view request.params %O`, request.params);

  const plugin = application.installedPlugins.find(
    (plugin) => plugin.id === pluginId,
  );
  plugin.package = getPackageData(plugin.filePath);

  debug(`render view plugins/view (plugin ${plugin.name})`);
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
