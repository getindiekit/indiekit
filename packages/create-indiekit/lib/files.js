#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { getDockerComposeFileContent, getDockerEnvironment } from "./docker.js";

/**
 * Get file contents
 * @param {string} fileName - Filename
 * @returns {Promise<string>} File contents
 */
export const getFileContents = async (fileName) => {
  try {
    const filesDirectory = path.join(import.meta.url, "../../files/");
    const filePath = new URL(fileName, filesDirectory);
    const contents = await readFile(filePath, { encoding: "utf8" });

    return contents;
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

/**
 * Get files to create
 * @param {object} setup - Setup answers
 * @returns {Promise<Array>} - Files to create
 */
export const getFiles = async (setup) => {
  const { me, useDocker } = setup;

  const files = [
    {
      path: "README.md",
      contents: `# Indiekit server for ${me}\n\nLearn more at <https://getindiekit.com>\n`,
    },
    {
      path: ".gitignore",
      contents: await getFileContents("template.gitignore"),
    },
    {
      path: path.join(".vscode", "launch.json"),
      contents: await getFileContents("template.vscode_launch.json"),
    },
  ];

  if (useDocker) {
    const environment = await getDockerEnvironment(setup);

    files.push(
      {
        path: "docker-compose.yml",
        contents: getDockerComposeFileContent(environment),
      },
      {
        path: "Dockerfile",
        contents: await getFileContents("template.dockerfile"),
      },
      {
        path: ".dockerignore",
        contents: await getFileContents("template.dockerignore"),
      },
    );
  }

  return files;
};
