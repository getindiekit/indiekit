import { addPluginConfig } from "./utils.js";

/**
 * Get package values
 * @param {SetupAnswers} setup - Setup answers
 * @returns {Promise<{ config: NewIndiekitConfig, dependencies: string[] }>} Package values
 */
export const getPackageValues = async (setup) => {
  const { me, presetPlugin, storePlugin, syndicatorPlugins } = setup;

  /**
   * @type {NewIndiekitConfig}
   */
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

/**
 * @import { SetupAnswers } from "./setup-prompts.js"
 * @import { NewIndiekitConfig } from "./utils.js"
 */
