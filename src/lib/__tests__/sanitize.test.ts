import { describe, expect, it } from "vitest";
import { sanitizePostContent } from "../sanitize";

describe("sanitizePostContent", () => {
  it("preserves ordinary WordPress post markup", () => {
    const html =
      '<p>Check out this <strong>mix</strong>.</p>' +
      '<img src="https://blog.djmixoftheweek.com/image.jpg" alt="cover" class="size-full" />' +
      '<h2>Tracklist</h2><ul><li>Track one</li></ul>';
    expect(sanitizePostContent(html)).toBe(html);
  });

  it("preserves iframes embedded directly in post content", () => {
    const html = '<iframe src="https://www.youtube.com/embed/abc" title="Embedded video"></iframe>';
    expect(sanitizePostContent(html)).toBe(html);
  });

  it("strips script tags and their contents", () => {
    const html = '<p>Hello</p><script>alert("xss")</script>';
    expect(sanitizePostContent(html)).toBe("<p>Hello</p>");
  });

  it("strips event-handler attributes", () => {
    const html = '<img src="https://example.com/a.jpg" onerror="alert(1)" alt="x" />';
    expect(sanitizePostContent(html)).toBe('<img src="https://example.com/a.jpg" alt="x" />');
  });

  it("strips javascript: hrefs", () => {
    const html = '<a href="javascript:alert(1)">click me</a>';
    expect(sanitizePostContent(html)).toBe("<a>click me</a>");
  });

  it("strips disallowed tags like form and input", () => {
    const html = '<form action="https://evil.example.com"><input name="x" /></form><p>safe</p>';
    expect(sanitizePostContent(html)).toBe("<p>safe</p>");
  });
});
