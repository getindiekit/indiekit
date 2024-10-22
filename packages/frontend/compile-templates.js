import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nunjucks from "nunjucks";
import * as filters from "./lib/filters/index.js";
import * as globals from "./lib/globals/index.js";

const __filename = fileURLToPath(import.meta.url);
const frontend_directory = path.join(__filename, "..");
const components_directory = path.join(frontend_directory, "components");
const layouts_directory = path.join(frontend_directory, "layouts");

// compiled templates (i.e. HTML files) will be written to this directory
const outdir = "public";
const public_directory = path.resolve(frontend_directory, outdir);

const buffer = fs.readFileSync(path.join(public_directory, "manifest.json"));
const manifest = JSON.parse(buffer.toString());
const entries = Object.entries(manifest);

const codemirrorCssPath = entries
  .find(([key]) => key.endsWith("codemirror.css"))[1]
  .replace("public/", "");

const cssPath = entries
  .find(([key]) => key.endsWith("app.css"))[1]
  .replace("public/", "");

const jsPath = entries
  .find(([key]) => key.endsWith("app.js"))[1]
  .replace("public/", "");

// TODO: inject codemirror.css in the compiled templates
console.log(`bundles`, {
  "codemirror.css": codemirrorCssPath,
  "app.css": cssPath,
  "app.js": jsPath,
});

const environment = nunjucks.configure(
  [components_directory, layouts_directory],
  {
    autoescape: true,
    lstripBlocks: true,
    trimBlocks: true,
    // throwOnUndefined: true, // Throw an error when undefined variables are used
    noCache: true, // Disable template caching for development
  },
);

environment.addFilter("debug", (value) => {
  console.log("=== DEBUG ===", value);
  return value;
});

const i18n = (key, ...arguments_) => {
  console.log(`[i18n] ${key}`);
  // TODO: translation logic goes here: gather all files declared in localazy.json
  // create a hash map with all translations for the chosen locale, then return
  // the value for the given key.
  return key ? `${key} ${arguments_.join(" ")}` : "default text";
};

for (const filter of Object.keys(filters)) {
  // eslint-disable-next-line import/namespace
  environment.addFilter(filter, filters[filter]);
}

for (const global of Object.keys(globals)) {
  // eslint-disable-next-line import/namespace
  environment.addGlobal(global, nunjucks.runtime.markSafe(globals[global]));
}
environment.addGlobal("__", nunjucks.runtime.markSafe(i18n));

const status = 418;
const error = new Error("I'm a Teapot");

const application = {
  cssPath,
  getInstalledPlugins: [],
  jsPath,
  localeUsed: "en",
  micropubEndpoint: "https://your-indiekit-server/micropub",
  name: "indiekit",
  navigation: [
    {
      href: "/status",
      text: "Status",
    },
  ],
  publication: { me: "https://your-domain.com" },
  themeColor: "#04f",
  themeColorScheme: "automatic",
  tokenEndpoint: "https://tokens.indieauth.com/token",
  url: "/", // Use this when testing with a local HTTP server
};

const options = {
  actions: [
    { icon: "create", href: "#", text: "Create" },
    { icon: "delete", href: "#", text: "Delete" },
  ],
  describedBy: "fake-aria-described-by",
  parent: { href: "#", text: "TODO" },
  photo: { src: "https://httpbin.org/image/svg" },
  role: "fake-aria-role",
};

environment.addGlobal("application", application);
environment.addGlobal("opts", options);
environment.addGlobal("stack", error.stack);
environment.addGlobal("status", status);

const templates = fs
  .readdirSync(path.join(layouts_directory))
  .filter((file) => file.endsWith(".njk"));

for (const fname of templates) {
  const fpath = path.join(layouts_directory, fname);
  const html = nunjucks.render(fpath, {
    template_name: fname,
  });
  //   console.log(`\n\nHTML compiled from ${fname}\n`, html);

  const outpath = path.join(outdir, fname.replace(".njk", ".html"));
  fs.writeFileSync(outpath, html);
  console.log(`Compiled ${fname} to ${outpath}`);
}
