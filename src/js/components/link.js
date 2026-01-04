import { escapeHtml, renderStyles } from "../utils/render-utils.js";

export function renderLink(block) {
  const target = block.data.external ? "_blank" : "_self";
  const href = block.data.external ? block.data.url : `{{basePath}}/${block.data.url}`;

  return `
    <a href="${href}"
       target="${target}"
       class="link ${renderStyles(block)}">
      ${escapeHtml(block.data.label)}
    </a>
  `;
}