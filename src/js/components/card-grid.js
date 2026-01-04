import { escapeHtml, renderStyles } from "../utils/render-utils.js";

export function renderCardGrid(block) {
  const cards = block.data.cards.map(card => `
    <div class="card">
      ${card.image ? `<img src="${card.image}" alt="">` : ""}
      <h3>${escapeHtml(card.title)}</h3>
      ${card.description ? `<p>${escapeHtml(card.description)}</p>` : ""}
      ${card.link ? `<a href="${card.link}">Learn more</a>` : ""}
    </div>
  `).join("");

  return `
    <section class="card-grid ${renderStyles(block)}">
      ${cards}
    </section>
  `;
}