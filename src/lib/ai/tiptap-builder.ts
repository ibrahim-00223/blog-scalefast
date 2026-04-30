import type { TipTapContent, TipTapNode } from "@/types";

/**
 * Parse inline marks from a Markdown string:
 * **bold**, *italic*, _italic_, [text](url)
 */
function parseInline(text: string): TipTapNode[] {
  if (!text) return [];

  const nodes: TipTapNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_|\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: "text", text: text.slice(lastIndex, match.index) });
    }

    if (match[0].startsWith("**")) {
      nodes.push({ type: "text", text: match[2], marks: [{ type: "bold" }] });
    } else if (match[0].startsWith("[")) {
      nodes.push({
        type: "text",
        text: match[5],
        marks: [{ type: "link", attrs: { href: match[6], target: "_blank" } }],
      });
    } else {
      // *italic* or _italic_
      nodes.push({
        type: "text",
        text: match[3] ?? match[4],
        marks: [{ type: "italic" }],
      });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push({ type: "text", text: text.slice(lastIndex) });
  }

  return nodes.length > 0 ? nodes : [{ type: "text", text }];
}

/**
 * Converts a Markdown string to a TipTap JSON document.
 * Handles: headings (#/##/###), bullet lists, ordered lists, paragraphs,
 * bold, italic, and links.
 */
export function markdownToTipTap(markdown: string): TipTapContent {
  const lines = markdown.split("\n");
  const nodes: TipTapNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Headings: # / ## / ###
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      nodes.push({
        type: "heading",
        attrs: { level },
        content: parseInline(headingMatch[2].trim()),
      });
      i++;
      continue;
    }

    // Bullet list: - or *
    if (/^[-*]\s+/.test(line)) {
      const items: TipTapNode[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^[-*]\s+/, "");
        items.push({
          type: "listItem",
          content: [{ type: "paragraph", content: parseInline(itemText) }],
        });
        i++;
      }
      nodes.push({ type: "bulletList", content: items });
      continue;
    }

    // Ordered list: 1. 2. etc.
    if (/^\d+\.\s+/.test(line)) {
      const items: TipTapNode[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\d+\.\s+/, "");
        items.push({
          type: "listItem",
          content: [{ type: "paragraph", content: parseInline(itemText) }],
        });
        i++;
      }
      nodes.push({ type: "orderedList", content: items });
      continue;
    }

    // Paragraph — accumulate consecutive non-structural lines
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].match(/^#{1,6}\s/) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }

    if (paragraphLines.length > 0) {
      nodes.push({
        type: "paragraph",
        content: parseInline(paragraphLines.join(" ")),
      });
    }
  }

  // Ensure the doc always has at least one node
  if (nodes.length === 0) {
    nodes.push({ type: "paragraph", content: [{ type: "text", text: "" }] });
  }

  return { type: "doc", content: nodes };
}
