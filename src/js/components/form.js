import { escapeHtml } from "../utils/render-utils.js";

export function renderForm(block) {
  const fields = block.data.fields.map(field => `
    <label>
      ${escapeHtml(field.label)}
      ${renderFormField(field)}
    </label>
  `).join("");

  return `
    <form class="contact-form"
          method="POST"
          action="${block.data.endpoint}">
      ${fields}
      <button type="submit">Send</button>
    </form>
  `;
}

function renderFormField(field) {
  if (field.type === "textarea") {
    const required = field.required ? "required" : "";
    return `<textarea name="${field.name}" ${required}></textarea>`;
  }
  
  const inputType = field.type || "text";
  const required = field.required ? "required" : "";
  return `<input type="${inputType}" name="${field.name}" ${required} />`;
}