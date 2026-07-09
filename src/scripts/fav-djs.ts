type FavDJ = { slug: string; name: string };

document.addEventListener('alpine:init', () => {
  Alpine.store('favDJs', {
    items: JSON.parse(localStorage.getItem('favDJs') || '[]') as FavDJ[],
    toggle(slug: string, name: string) {
      const items = this.items as FavDJ[];
      const idx = items.findIndex((dj) => dj.slug === slug);
      if (idx >= 0) {
        items.splice(idx, 1);
      } else {
        items.push({ slug, name });
      }
      localStorage.setItem('favDJs', JSON.stringify(items));
    },
    has(slug: string) {
      return (this.items as FavDJ[]).some((dj) => dj.slug === slug);
    },
  });
});
