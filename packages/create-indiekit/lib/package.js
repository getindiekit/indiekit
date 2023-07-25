import { addPluginConfig } from "./utils.js";

/**
 * Get package values
 * @param {object} setup - Setup answers
 * @returns {Promise<object>} Package values
 */
export const getPackageValues = async (setup) => {
  const { me, presetPlugin, storePlugin, syndicatorPlugins } = setup;

  const config = {
    plugins: [],
    publication: { me },
  };

  const dependencies = ["@indiekit/indiekit"];

  if (presetPlugin) {
    dependencies.push(presetPlugin);
    await addPluginConfig(presetPlugin, config);
  }

  if (storePlugin) {
    dependencies.push(storePlugin);
    await addPluginConfig(storePlugin, config);
  }

  if (syndicatorPlugins) {
    for await (const syndicatorPlugin of syndicatorPlugins) {
      dependencies.push(syndicatorPlugin);
      await addPluginConfig(syndicatorPlugin, config);
    }
  }

  return {
    config,
    dependencies,
  };
};
