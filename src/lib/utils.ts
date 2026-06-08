export function capitaliseAndRemoveHyphens(string: string | undefined, fallback = 'Unknown'): string {
  if (!string) return fallback;
  return string
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
