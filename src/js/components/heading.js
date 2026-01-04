import { escapeHtml, renderStyles } from "../utils/render-utils.js";

export function renderHeading(block) {
  const level = block.data.level;
  return `
    <h${level} class="${renderStyles(block)}">
      ${escapeHtml(block.data.text)}
    </h${level}>
  `;
}