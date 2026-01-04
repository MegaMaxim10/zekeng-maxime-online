import path from "node:path";

export function buildSiteGraph(pages, contentDir = "content") {
  const byDir = {};

  pages.forEach(p => {
    if (!byDir[p.dir]) byDir[p.dir] = [];
    byDir[p.dir].push(p);
  });

  Object.keys(byDir).forEach(dir => {
    byDir[dir].sort((a, b) => a.name.localeCompare(b.name));
    byDir[dir].main = byDir[dir][0];
  });

  return {
    contentDir,
    pages,
    byDir
  };
}

export function outputPathFor(page, contentDir = "content") {
  const relDir = page.dir.replace(contentDir, "").replace(/^[/\\]/, "");

  if (!relDir) {
    return "index.html";
  }

  return path.join(
    relDir,
    page.name.replace(".json", ".html")
  );
}

export function urlFor(page, siteGraph, basePath = "") {
  const out = outputPathFor(page, siteGraph.contentDir)
    .replaceAll("\\", "/");

  return `${basePath}/${out}`.replaceAll(/\/+/g, "/");
}
