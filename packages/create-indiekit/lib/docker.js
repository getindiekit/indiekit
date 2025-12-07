import { randomString } from "@indiekit/util";
import YAML from "yaml";

import { getPlugin } from "./utils.js";

/**
 * Get Docker Compose file contents
 * @param {Array} environment - Environment variables
 * @returns {string} Docker Compose file contents
 */
export const getDockerComposeFileContent = (environment) => {
  const compose = {
    name: "indiekit",
    services: {
      indiekit: {
        build: ".",
        restart: "always",
        ports: ["${HTTP_PORT:-3000}:3000"],
        environment: [
          "MONGO_URL=mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@mongo",
          "PASSWORD_SECRET",
          "SECRET",
          ...environment,
        ],
      },
      mongo: {
        image: "mongo:4",
        restart: "always",
        volumes: ["mongo:/data/db"],
        environment: [
          "MONGO_INITDB_ROOT_USERNAME",
          "MONGO_INITDB_ROOT_PASSWORD",
        ],
      },
    },
    volumes: {
      mongo: {},
    },
  };

  return YAML.stringify(compose);
};

/**
 * Get .env file contents
 * @param {Array} environment - Environment variables
 * @returns {string} .env file contents
 */
export const getDockerEnvironmentFileContent = (environment) => {
  let dotenv = "";

  dotenv += `MONGO_INITDB_ROOT_USERNAME='admin'\n`;
  dotenv += `MONGO_INITDB_ROOT_PASSWORD='${randomString(24)}'\n`;
  dotenv += `SECRET='${randomString(24)}'\n\n`;
  dotenv += `# TODO: Add a password secret\n`;
  dotenv += `# PASSWORD_SECRET='<REQUIRED>'\n`;

  if (environment.length > 0) {
    dotenv += `\n# TODO: Add plug-in secrets\n`;
  }

  for (const variable of environment) {
    dotenv += `# ${variable}='<REQUIRED>'\n`;
  }

  return dotenv;
};

/**
 * Get environment variables required by plug-ins
 * @param {object} setup - Setup answers
 * @returns {Promise<Array>} Environment variables
 */
export const getDockerEnvironment = async (setup) => {
  const { storePlugin, syndicatorPlugins } = setup;

  let variables = [];

  if (storePlugin) {
    const { environment } = await getPlugin(storePlugin);
    variables = [...variables, ...(environment || [])];
  }

  if (syndicatorPlugins) {
    for await (const syndicatorPlugin of syndicatorPlugins) {
      const { environment } = await getPlugin(syndicatorPlugin);
      variables = [...variables, ...(environment || [])];
    }
  }

  return variables;
};
