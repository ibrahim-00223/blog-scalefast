import type { TipTapContent, TipTapNode } from "@/types";

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getPlainText(node: TipTapNode): string {
  if (node.type === "text") {
    return node.text || "";
  }

  return node.content?.map(getPlainText).join("") || "";
}

export function tipTapToPlainText(content: TipTapContent | null): string {
  if (!content?.content) return "";
  return content.content
    .map((node) => {
      const text = getPlainText(node);
      // Add newlines between top-level blocks for readability
      return text ? text + "\n" : "";
    })
    .join("")
    .trim();
}

function nodeToHtml(node: TipTapNode): string {
  if (node.type === "text") {
    let text = escapeHtml(node.text || "");
    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === "bold") text = `<strong>${text}</strong>`;
        else if (mark.type === "italic") text = `<em>${text}</em>`;
        else if (mark.type === "code") text = `<code>${text}</code>`;
        else if (mark.type === "link") {
          const href = escapeHtml((mark.attrs?.href as string) || "#");
          text = `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
      }
    }
    return text;
  }

  const children = node.content?.map(nodeToHtml).join("") || "";

  switch (node.type) {
    case "paragraph":
      return `<p>${children}</p>`;
    case "heading": {
      const level = (node.attrs?.level as number) || 2;
      const id = slugify(children.replace(/<[^>]+>/g, ""));
      return `<h${level} id="${id}">${children}</h${level}>`;
    }
    case "bulletList":
      return `<ul>${children}</ul>`;
    case "orderedList":
      return `<ol>${children}</ol>`;
    case "listItem":
      return `<li>${children}</li>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${children}</code></pre>`;
    case "horizontalRule":
      return "<hr />";
    case "hardBreak":
      return "<br />";
    case "image": {
      const src = escapeHtml((node.attrs?.src as string) || "");
      const alt = escapeHtml((node.attrs?.alt as string) || "");
      return `<img src="${src}" alt="${alt}" loading="lazy" />`;
    }
    default:
      return children;
  }
}

export function tipTapToHtml(content: TipTapContent | null): string {
  if (!content?.content) return "";
  return content.content.map(nodeToHtml).join("");
}

export function extractHeadings(
  content: TipTapContent | null
): { id: string; text: string; level: number }[] {
  if (!content?.content) return [];
  const headings: { id: string; text: string; level: number }[] = [];

  function walk(nodes: TipTapNode[]) {
    for (const node of nodes) {
      if (node.type === "heading") {
        const text = getPlainText(node);
        const id = slugify(text);
        const level = (node.attrs?.level as number) || 2;
        if (level <= 3) headings.push({ id, text, level });
      }
      if (node.content) walk(node.content);
    }
  }

  walk(content.content);
  return headings;
}

export function extractFaqs(
  content: TipTapContent | null
): { question: string; answer: string }[] {
  if (!content?.content) return [];
  const faqs: { question: string; answer: string }[] = [];
  const nodes = content.content;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === "heading" && (node.attrs?.level as number) === 3) {
      const question = getPlainText(node);
      if (question.endsWith("?")) {
        const answerNode = nodes[i + 1];
        if (answerNode?.type === "paragraph") {
          const answer = getPlainText(answerNode);
          faqs.push({ question, answer });
        }
      }
    }
  }

  return faqs;
}

export function getArticleUrl(categorySlug: string, articleSlug: string): string {
  return `/blog/${categorySlug}/${articleSlug}`;
}

export function getCategoryUrl(categorySlug: string): string {
  return `/blog/${categorySlug}`;
}
