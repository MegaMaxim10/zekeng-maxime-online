import { escapeHtml, renderStyles } from "../utils/render-utils.js";

export function renderLink(block) {
  const target = block.data.external ? "_blank" : "_self";

  return `
    <a href="${block.data.url}"
       target="${target}"
       class="link ${renderStyles(block)}">
      ${escapeHtml(block.data.label)}
    </a>
  `;
}