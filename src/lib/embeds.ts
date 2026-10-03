export const addIframeTitle = (html: string, fallbackTitle: string): string =>
  html.replace(/<iframe\b[^>]*>/gi, (tag) =>
    /\btitle\s*=/i.test(tag) ? tag : tag.replace(/^<iframe/i, `<iframe title="${fallbackTitle}"`)
  );

export const addIframeLazyLoading = (html: string): string =>
  html.replace(/<iframe\b[^>]*>/gi, (tag) =>
    /\bloading\s*=/i.test(tag) ? tag : tag.replace(/^<iframe/i, `<iframe loading="lazy"`)
  );

export const sanitizeEmbed = (html: string, allowedHostname: string, title: string): string => {
  if (!html) return '';
  const srcMatch = html.match(/src="([^"]+)"/);
  if (!srcMatch) return '';
  try {
    const url = new URL(srcMatch[1]);
    if (url.hostname !== allowedHostname) return '';
  } catch {
    return '';
  }
  return addIframeLazyLoading(addIframeTitle(html, title));
};
