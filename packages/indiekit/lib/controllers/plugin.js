import path from "node:path";
import { getPackageData } from "../utils.js";

export const list = (request, response) => {
  const { application } = response.app.locals;

  const pluginRows = application.installedPlugins.map((plugin) => {
    const _package = getPackageData(plugin.filePath);

    let name = `<h2><a href="/plugins/${plugin.id}">${plugin.name}</a></h2>`;

    if (_package.description) {
      name += `<p>${_package.description}</p>`;
    }

    return [
      {
        text: name,
        classes: "s-flow",
      },
      {
        text: _package.version,
      },
    ];
  });

  response.render("plugins/list", {
    parent: {
      href: "/status/",
      text: response.locals.__("status.title"),
    },
    title: response.locals.__("status.application.installedPlugins"),
    pluginRows,
  });
};

export const view = (request, response) => {
  const { application } = response.app.locals;
  const { pluginId } = request.params;

  const plugin = application.installedPlugins.find(
    (plugin) => plugin.id === pluginId,
  );
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
