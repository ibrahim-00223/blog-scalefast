import { describe, it, expect } from "vitest";
import {
  slugify,
  formatDate,
  tipTapToHtml,
  tipTapToPlainText,
  extractHeadings,
  extractFaqs,
  getArticleUrl,
  getCategoryUrl,
} from "@/lib/utils";
import type { TipTapContent } from "@/types";

// ─── slugify ─────────────────────────────────────────────────────────────────

describe("slugify", () => {
  it("lowercases input", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes accents", () => {
    expect(slugify("Équipe Révolution")).toBe("equipe-revolution");
  });

  it("replaces non-alphanumeric chars with hyphens", () => {
    expect(slugify("cold email & SDR 2.0")).toBe("cold-email-sdr-2-0");
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugify("---hello---")).toBe("hello");
  });

  it("collapses multiple separators into one hyphen", () => {
    expect(slugify("hello   world")).toBe("hello-world");
  });
});

// ─── formatDate ──────────────────────────────────────────────────────────────

describe("formatDate", () => {
  it("returns a French-formatted date string", () => {
    const result = formatDate("2026-04-30T00:00:00.000Z");
    // Accept locale variations (e.g. "30 avril 2026" or "30 avril 2026")
    expect(result).toMatch(/avril/);
    expect(result).toMatch(/2026/);
  });
});

// ─── tipTapToHtml ─────────────────────────────────────────────────────────────

describe("tipTapToHtml", () => {
  it("returns empty string for null content", () => {
    expect(tipTapToHtml(null)).toBe("");
  });

  it("renders a paragraph", () => {
    const doc: TipTapContent = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Bonjour" }] },
      ],
    };
    expect(tipTapToHtml(doc)).toBe("<p>Bonjour</p>");
  });

  it("renders bold text", () => {
    const doc: TipTapContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Hello", marks: [{ type: "bold" }] },
          ],
        },
      ],
    };
    expect(tipTapToHtml(doc)).toBe("<p><strong>Hello</strong></p>");
  });

  it("renders headings with ids", () => {
    const doc: TipTapContent = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Mon titre" }],
        },
      ],
    };
    const html = tipTapToHtml(doc);
    expect(html).toContain("<h2");
    expect(html).toContain("mon-titre");
    expect(html).toContain("Mon titre");
  });

  it("escapes HTML special characters", () => {
    const doc: TipTapContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: '<script>alert("xss")</script>' }],
        },
      ],
    };
    const html = tipTapToHtml(doc);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("renders bullet lists", () => {
    const doc: TipTapContent = {
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Item" }],
                },
              ],
            },
          ],
        },
      ],
    };
    expect(tipTapToHtml(doc)).toContain("<ul><li><p>Item</p></li></ul>");
  });
});

// ─── tipTapToPlainText ────────────────────────────────────────────────────────

describe("tipTapToPlainText", () => {
  it("returns empty string for null", () => {
    expect(tipTapToPlainText(null)).toBe("");
  });

  it("extracts text from all blocks, not just the first", () => {
    const doc: TipTapContent = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Premier" }] },
        { type: "paragraph", content: [{ type: "text", text: "Deuxieme" }] },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Titre section" }],
        },
      ],
    };
    const text = tipTapToPlainText(doc);
    expect(text).toContain("Premier");
    expect(text).toContain("Deuxieme");
    expect(text).toContain("Titre section");
  });
});

// ─── extractHeadings ──────────────────────────────────────────────────────────

describe("extractHeadings", () => {
  it("returns empty array for null", () => {
    expect(extractHeadings(null)).toEqual([]);
  });

  it("extracts h2 and h3 headings with ids and levels", () => {
    const doc: TipTapContent = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Pourquoi le GTM" }],
        },
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "Les bases" }],
        },
        {
          type: "heading",
          attrs: { level: 4 },
          content: [{ type: "text", text: "Profondeur" }],
        },
      ],
    };
    const headings = extractHeadings(doc);
    expect(headings).toHaveLength(2); // h4 excluded
    expect(headings[0]).toMatchObject({ level: 2, text: "Pourquoi le GTM", id: "pourquoi-le-gtm" });
    expect(headings[1]).toMatchObject({ level: 3, text: "Les bases" });
  });
});

// ─── extractFaqs ──────────────────────────────────────────────────────────────

describe("extractFaqs", () => {
  it("returns empty array for null", () => {
    expect(extractFaqs(null)).toEqual([]);
  });

  it("extracts FAQ items from h3+paragraph pairs ending with ?", () => {
    const doc: TipTapContent = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "Qu'est-ce que le GTM ?" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Le GTM est une approche..." }],
        },
      ],
    };
    const faqs = extractFaqs(doc);
    expect(faqs).toHaveLength(1);
    expect(faqs[0].question).toBe("Qu'est-ce que le GTM ?");
    expect(faqs[0].answer).toBe("Le GTM est une approche...");
  });

  it("ignores h3 headings not ending with ?", () => {
    const doc: TipTapContent = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "Introduction au GTM" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Ceci est une intro" }],
        },
      ],
    };
    expect(extractFaqs(doc)).toHaveLength(0);
  });

  it("ignores h3 not followed by a paragraph", () => {
    const doc: TipTapContent = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "Une question ?" }],
        },
        {
          type: "bulletList",
          content: [],
        },
      ],
    };
    expect(extractFaqs(doc)).toHaveLength(0);
  });
});

// ─── URL helpers ──────────────────────────────────────────────────────────────

describe("getArticleUrl", () => {
  it("builds the correct URL", () => {
    expect(getArticleUrl("sales", "mon-article")).toBe("/blog/sales/mon-article");
  });
});

describe("getCategoryUrl", () => {
  it("builds the correct URL", () => {
    expect(getCategoryUrl("gtm-engineering")).toBe("/blog/gtm-engineering");
  });
});
