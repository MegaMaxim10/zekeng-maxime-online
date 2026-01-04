import * as fs from 'node:fs';

export function renderHtmlContent(block) {
    let htmlPath = block.data.url;
    const html = fs.readFileSync(htmlPath, "utf-8");

    return `<div class="html-content">${html}</div>`;
}