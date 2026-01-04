import path from "node:path";
import { urlFor } from "./site-graph.js";

function compareAlphabetically(a, b) {
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function generateNavigation(siteGraph, basePath = "") {
  const { byDir, contentDir } = siteGraph;
  const root = byDir[contentDir].main;

  let html = `<ul>`;
  html += `<li><a href="${urlFor(root, siteGraph, basePath)}">Home</a></li>`;

  Object.keys(byDir)
    .filter(dir => dir !== contentDir && path.dirname(dir) === contentDir)
    .sort(compareAlphabetically)
    .forEach(dir => {
      const main = byDir[dir].main;
      const title = main.json.meta?.title || main.json.header?.title;

      html += `<li>`;
      html += `<a href="${urlFor(main, siteGraph, basePath)}">${title}</a>`;

      if (
        main.json.meta?.genSubMenus === undefined ||
        main.json.meta?.genSubMenus === true
      ) {
        const children = Object.keys(byDir)
          .filter(d => path.dirname(d) === dir)
          .sort(compareAlphabetically);

        if (children.length) {
          html += `<ul>`;
          children.forEach(cd => {
            const childMain = byDir[cd].main;
            const ct =
              childMain.json.meta?.title ||
              childMain.json.header?.title;

            html += `<li><a href="${urlFor(childMain, siteGraph, basePath)}">${ct}</a></li>`;
          });
          html += `</ul>`;
        }
      }

      html += `</li>`;
    });

  html += `</ul>`;
  return html;
}

export function generateBreadcrumb(page, siteGraph, basePath = "") {
  const parts = page.dir
    .replace(siteGraph.contentDir, "")
    .split(/[\\/]/)
    .filter(Boolean);

  let html = `<a href="${basePath}/">Home</a>`;
  let acc = siteGraph.contentDir;
  
  parts.forEach(part => {
    acc = path.join(acc, part);
    const main = siteGraph.byDir[acc]?.main;
    if (main) {
      const title =
        main.json.meta?.title ||
        main.json.header?.title;

      html += ` &raquo; <a href="${urlFor(main, siteGraph, basePath)}">${title}</a>`;
    }
  });

  return html;
}

export function generateRelatedPages(page, siteGraph, basePath = "") {
  if (page.json.meta?.genRelatedPages !== true) return "";

  const related = siteGraph.pages.filter(
    p => p.dir.startsWith(page.dir) && p !== page
  );

  if (!related.length) return "";

  const links = related
    .map(p => {
      const title = p.json.meta?.title || p.json.header?.title;
      return `<li><a href="${urlFor(p, siteGraph, basePath)}">${title}</a></li>`;
    })
    .join("");

  return `
    <section class="related-pages">
      <h2>Related Pages</h2>
      <ul>${links}</ul>
    </section>
  `;
}
