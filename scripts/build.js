import * as fs from "node:fs";
import path from "node:path";
import { globSync } from "glob";
import { renderPage, siteData } from "../src/js/renderer.js";

const CONTENT_DIR = "content";
const OUTPUT_DIR = "public";
const ASSETS_DIR = "assets";
const CSS_DIR = "src/css";
const CUSTOM_JS_DIR = "src/js/custom";
const TEMPLATE_PATH = "src/templates/page.html";
const SITE_TITLE = siteData.title || "My Static Site";
const BASE_PATH = process.env.BASE_PATH || "";

if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUTPUT_DIR);

const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

function applyTemplate(template, variables) {
  return template.replaceAll(/{{(\w+)}}/g, (_, key) => variables[key] ?? "");
}

function loadAllPages() {
  const files = globSync(`${CONTENT_DIR}/**/*.json`);
  return files.map(file => {
    const json = JSON.parse(fs.readFileSync(file, "utf-8"));
    return {
      file,
      json,
      dir: path.dirname(file),
      name: path.basename(file),
    };
  });
}

const pages = loadAllPages();

const mainPageByDir = {};

pages.forEach(p => {
  if (!mainPageByDir[p.dir]) {
    mainPageByDir[p.dir] = [];
  }
  mainPageByDir[p.dir].push(p);
});

Object.keys(mainPageByDir).forEach(dir => {
  mainPageByDir[dir].sort(compareAlphabetically);
  mainPageByDir[dir].main = mainPageByDir[dir][0];
});

function outputPathFor(page) {
  const relDir = page.dir.replace(CONTENT_DIR, "").replace(/^[/\\]/, "");

  if (relDir === "") {
    return "index.html";
  }

  return path.join(relDir, page.name.replace(".json", ".html"));
}

function urlFor(page) {
  return "/" + outputPathFor(page).replaceAll("\\", "/");
}

function compareAlphabetically(a, b) {
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function generateNavigation() {
  const root = mainPageByDir[CONTENT_DIR].main;

  let html = `<ul>`;
  html += `<li><a href="{{basePath}}${urlFor(root)}">Home</a></li>`;

  Object.keys(mainPageByDir)
    .filter(dir => dir !== CONTENT_DIR && path.dirname(dir) === CONTENT_DIR)
    .sort(compareAlphabetically)
    .forEach(dir => {
      const main = mainPageByDir[dir].main;
      const title = main.json.meta?.title || main.json.header?.title;

      html += `<li>`;
      html += `<a href="{{basePath}}${urlFor(main)}">${title}</a>`;

      if (main.json.meta?.genSubMenus === undefined || main.json.meta?.genSubMenus === true) {
        const childrenDirs = Object.keys(mainPageByDir)
          .filter(d => path.dirname(d) === dir)
          .sort(compareAlphabetically);

        if (childrenDirs.length) {
          html += `<ul>`;
          childrenDirs.forEach(cd => {
            const childMain = mainPageByDir[cd].main;
            const ct = childMain.json.meta?.title || childMain.json.header?.title;
            html += `<li><a href="{{basePath}}${urlFor(childMain)}">${ct}</a></li>`;
          });
          html += `</ul>`;
        }
      }

      html += `</li>`;
    });

  html += `</ul>`;
  return applyTemplate(html, { basePath: BASE_PATH });
}

function generateBreadcrumb(page) {
  const parts = page.dir.replace(CONTENT_DIR, "").split(/[\\/]/).filter(Boolean);
  let html = `<a href="{{basePath}}/">Home</a>`;
  let acc = CONTENT_DIR;

  parts.forEach(part => {
    acc = path.join(acc, part);
    const main = mainPageByDir[acc]?.main;
    if (main) {
      html += ` &raquo; <a href="{{basePath}}${urlFor(main)}">${main.json.meta?.title || main.json.header?.title}</a>`;
    }
  });

  return applyTemplate(html, { basePath: BASE_PATH });
}

function generateRelatedPages(page) {
  if (page.json.meta?.genRelatedPages !== true) return "";

  const dir = page.dir;
  const related = pages.filter(p => p.dir.startsWith(dir) && p !== page);

  if (!related.length) return "";

  const links = related.map(p => {
    const title = p.json.meta?.title || p.json.header?.title;
    return `<li><a href="{{basePath}}${urlFor(p)}">${title}</a></li>`;
  }).join("");

  return applyTemplate(`
    <section class="related-pages">
      <h2>Related Pages</h2>
      <ul>${links}</ul>
    </section>
  `, { basePath: BASE_PATH });
}

const lastModified = new Date().toISOString().split("T")[0];
const navigation = generateNavigation();

pages.forEach(page => {
  const htmlContent = applyTemplate(renderPage(page.json), { basePath: BASE_PATH });

  const finalHtml = applyTemplate(template, {
    basePath: BASE_PATH,
    title: page.json.meta?.title || page.json.header?.title || SITE_TITLE,
    siteTitle: SITE_TITLE,
    homeLink: "/",
    navigation: navigation,
    breadcrumb: generateBreadcrumb(page),
    content: htmlContent,
    relatedPages: generateRelatedPages(page),
    year: new Date().getFullYear(),
    lastModified
  });

  const outPath = path.join(OUTPUT_DIR, outputPathFor(page));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, finalHtml);

  console.log(`✔ Generated: ${outPath}`);
});

console.log(`Copying static assets...`);

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
    console.log(`Copied ${srcPath} to ${destPath}`);
  }
}

copyDir(ASSETS_DIR, path.join(OUTPUT_DIR, "assets"));
copyDir(CSS_DIR, path.join(OUTPUT_DIR, "assets/css"));
copyDir(CUSTOM_JS_DIR, path.join(OUTPUT_DIR, "assets/js/custom"));

console.log("\nStatic site generation complete.");