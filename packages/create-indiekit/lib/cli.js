import { createRequire } from "node:module";
import { parseArgs } from "node:util";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

export const usage = `Usage: npm create indiekit [directory]

Creates an Indiekit server in [directory], asking which content store,
preset and syndicators to use.

Options:
  -h, --help     Show this message
  -v, --version  Show version number`;

/**
 * Parse command-line arguments
 *
 * Parsed non-strictly so that an unrecognised option is reported by name
 * rather than throwing, and so a future option cannot crash an older binary.
 * @param {string[]} argv - Arguments, excluding the Node and script paths
 * @returns {object} Parsed arguments
 */
export const parseCliArguments = (argv) => {
  const { values, positionals } = parseArgs({
    args: argv,
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
    allowPositionals: true,
    strict: false,
  });

  const known = new Set(["help", "version"]);

  return {
    help: Boolean(values.help),
    version: Boolean(values.version),
    directory: positionals[0],
    unknownOption: Object.keys(values).find((key) => !known.has(key)),
  };
};

/**
 * Get the message and exit code for a set of parsed arguments, or false if
 * the setup flow should run
 * @param {object} parsed - Parsed arguments from `parseCliArguments`
 * @returns {object|boolean} Message and exit code, else false
 */
export const getCliResult = (parsed) => {
  if (parsed.help) {
    return { message: usage, code: 0 };
  }

  if (parsed.version) {
    return { message: version, code: 0 };
  }

  if (parsed.unknownOption) {
    return {
      message: `Unknown option: --${parsed.unknownOption}\n\n${usage}`,
      code: 1,
    };
  }

  // `base-create` requires a directory, but only checks once every setup
  // question has been answered. Checking here keeps those answers from
  // being thrown away.
  if (!parsed.directory) {
    return { message: `Provide a directory.\n\n${usage}`, code: 1 };
  }

  return false;
};
