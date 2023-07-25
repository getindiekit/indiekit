#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import process from "node:process";
import path from "node:path";

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
  const { me } = setup;

  const files = [
    {
      path: "README.md",
      contents: `# Indiekit server for ${me}\n\nLearn more at <https://getindiekit.com>\n`,
    },
    {
      path: ".gitignore",
      contents: await getFileContents("template.gitignore"),
    },
  ];

  return files;
};
