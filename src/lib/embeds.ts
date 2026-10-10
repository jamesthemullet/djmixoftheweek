export const addIframeTitle = (html: string, fallbackTitle: string): string =>
  html.replace(/<iframe\b[^>]*>/gi, (tag) =>
    /\btitle\s*=/i.test(tag) ? tag : tag.replace(/^<iframe/i, `<iframe title="${fallbackTitle}"`)
  );

export const addIframeLazyLoading = (html: string): string =>
  html.replace(/<iframe\b[^>]*>/gi, (tag) =>
    /\bloading\s*=/i.test(tag) ? tag : tag.replace(/^<iframe/i, `<iframe loading="lazy"`)
  );

const ALLOWED_IFRAME_ATTRS = new Set([
  'src',
  'width',
  'height',
  'frameborder',
  'scrolling',
  'allow',
  'allowfullscreen',
  'title',
  'loading',
]);

export const sanitizeEmbed = (html: string, allowedHostname: string, title: string): string => {
  if (!html) return '';
  const iframeMatch = html.match(/<iframe\b([^>]*)>/i);
  if (!iframeMatch) return '';
  const attrsString = iframeMatch[1];

  const srcMatch = attrsString.match(/\bsrc\s*=\s*"([^"]*)"/i);
  if (!srcMatch) return '';
  try {
    const url = new URL(srcMatch[1]);
    if (url.hostname !== allowedHostname) return '';
  } catch {
    return '';
  }

  // Rebuild the tag from an attribute allowlist so WP-sourced attributes
  // (e.g. onload=) never reach the page unescaped.
  const attrPairs = [...attrsString.matchAll(/([a-zA-Z0-9-]+)\s*=\s*"([^"]*)"/g)]
    .filter(([, name]) => ALLOWED_IFRAME_ATTRS.has(name.toLowerCase()))
    .map(([, name, value]) => `${name}="${value}"`);

  const rebuiltTag = `<iframe ${attrPairs.join(' ')}></iframe>`;
  return addIframeLazyLoading(addIframeTitle(rebuiltTag, title));
};
