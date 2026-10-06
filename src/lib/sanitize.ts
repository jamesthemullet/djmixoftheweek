import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "hr",
  "div",
  "span",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "img",
  "figure",
  "figcaption",
  "ul",
  "ol",
  "li",
  "blockquote",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "s",
  "strike",
  "sub",
  "sup",
  "mark",
  "code",
  "pre",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
  "caption",
  "iframe",
];

const ALLOWED_ATTRIBUTES = {
  a: ["href", "target", "rel", "title", "class"],
  img: ["src", "srcset", "sizes", "alt", "title", "width", "height", "loading", "class"],
  iframe: ["src", "title", "width", "height", "allow", "allowfullscreen", "loading", "frameborder"],
  "*": ["class", "id", "style"],
};

/**
 * Sanitizes raw WordPress post-body HTML before it is injected via `set:html`,
 * stripping scripts and event-handler attributes while preserving the markup
 * (headings, images, embeds, formatting) that real post content relies on.
 */
export const sanitizePostContent = (html: string): string =>
  sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
  });
