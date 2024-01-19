import { fileURLToPath } from "node:url";
import { bundleAsync } from "lightningcss";

let { code } = await bundleAsync({
  filename: fileURLToPath(new URL("../styles/app.css", import.meta.url)),
  minify: true,
});

export const styles = () => code.toString();
