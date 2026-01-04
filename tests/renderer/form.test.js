import { describe, it, expect } from "vitest";
import { renderForm } from "../../src/js/components/form.js";

describe("renderForm", () => {
    it("renders a form", () => {
        const form = {
            type: "form",
            data: {
            endpoint: "/contact",
            fields: [
                { name: "email", label: "Email", required: true },
                { name: "message", label: "Message", type: "textarea" }
            ]
            }
        };

        const html = renderForm(form);
        expect(html).toContain("<form");
        expect(html).toContain("textarea");
        expect(html).toContain("Email");
    });
});
