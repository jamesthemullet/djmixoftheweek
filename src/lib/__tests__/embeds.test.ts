import { describe, expect, it } from 'vitest';
import { addIframeTitle, sanitizeEmbed } from '../embeds';

describe('addIframeTitle', () => {
  it('adds a title attribute to an iframe with none', () => {
    const html = '<iframe src="https://example.com"></iframe>';
    expect(addIframeTitle(html, 'Embedded video')).toBe(
      '<iframe title="Embedded video" src="https://example.com"></iframe>'
    );
  });

  it('leaves an iframe with an existing title untouched', () => {
    const html = '<iframe title="Already titled" src="https://example.com"></iframe>';
    expect(addIframeTitle(html, 'Embedded video')).toBe(html);
  });

  it('adds titles to multiple iframes missing one', () => {
    const html = '<iframe src="https://a.com"></iframe><iframe src="https://b.com"></iframe>';
    const result = addIframeTitle(html, 'Embedded video');
    expect(result).toBe(
      '<iframe title="Embedded video" src="https://a.com"></iframe><iframe title="Embedded video" src="https://b.com"></iframe>'
    );
  });

  it('returns non-iframe content unchanged', () => {
    const html = '<p>No iframes here</p>';
    expect(addIframeTitle(html, 'Embedded video')).toBe(html);
  });
});

describe('sanitizeEmbed', () => {
  it('returns an empty string when given falsy html', () => {
    expect(sanitizeEmbed('', 'w.soundcloud.com', 'SoundCloud player')).toBe('');
  });

  it('returns an empty string when no src attribute is present', () => {
    expect(sanitizeEmbed('<iframe></iframe>', 'w.soundcloud.com', 'SoundCloud player')).toBe('');
  });

  it('returns an empty string when the src hostname is not allowed', () => {
    const html = '<iframe src="https://evil.example.com/embed"></iframe>';
    expect(sanitizeEmbed(html, 'w.soundcloud.com', 'SoundCloud player')).toBe('');
  });

  it('returns an empty string when the src is not a valid URL', () => {
    const html = '<iframe src="not-a-url"></iframe>';
    expect(sanitizeEmbed(html, 'w.soundcloud.com', 'SoundCloud player')).toBe('');
  });

  it('adds a title to an allowed embed with none', () => {
    const html = '<iframe src="https://w.soundcloud.com/player/?url=123"></iframe>';
    expect(sanitizeEmbed(html, 'w.soundcloud.com', 'SoundCloud player')).toBe(
      '<iframe title="SoundCloud player" src="https://w.soundcloud.com/player/?url=123"></iframe>'
    );
  });

  it('preserves an existing title on an allowed embed', () => {
    const html = '<iframe title="Custom title" src="https://w.soundcloud.com/player/?url=123"></iframe>';
    expect(sanitizeEmbed(html, 'w.soundcloud.com', 'SoundCloud player')).toBe(html);
  });
});
