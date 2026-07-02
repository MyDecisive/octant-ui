import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const toAbsolute = (p: string) => path.resolve(__dirname, p);

const indexFilePath = "../dist/index.html";
const redirectScriptFilePath = "../demo/redirect.html";
const fourOhFourFilePath = "../demo/404.html";

const octantUIPageTitle = "<title>MyDecisive Octant UI</title>";

const index = fs.readFileSync(toAbsolute(indexFilePath), "utf-8");

(() => {
  const redirectScript = fs.readFileSync(
    toAbsolute(redirectScriptFilePath),
    "utf-8",
  );

  let updatedHtml = index;

  updatedHtml = index.replace(
    octantUIPageTitle,
    `   ${redirectScript}
    ${octantUIPageTitle}`,
  );

  const filePath = indexFilePath;

  const absolutePath = toAbsolute(filePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, updatedHtml);

  fs.copyFileSync(
    toAbsolute(fourOhFourFilePath),
    toAbsolute("../dist/404.html"),
  );
})();
