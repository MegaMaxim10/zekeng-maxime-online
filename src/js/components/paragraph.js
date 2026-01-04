import { escapeHtml, renderStyles } from "../utils/render-utils.js";

export function renderParagraph(block) {
  return `
    <p class="${renderStyles(block)}">
      ${escapeHtml(block.data.text)}
    </p>
  `;
}