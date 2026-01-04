import { escapeHtml, renderStyles } from "../utils/render-utils.js";

export function renderList(block) {
  const items = block.data.items
    .map(item => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    <ul class="${renderStyles(block)}">
      ${items}
    </ul>
  `;
}