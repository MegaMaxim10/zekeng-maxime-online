import { escapeHtml } from "../utils/render-utils.js";

export function renderAsset(block) {
  return `
    <div class="asset asset-${block.data.kind}">
      <a href="{{basePath}}/${block.data.src}" target="_blank">
        ${escapeHtml(block.data.label || "Download")}
      </a>
    </div>
  `;
}