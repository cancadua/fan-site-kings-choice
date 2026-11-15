/** Turns a heading into a URL-safe id, e.g. "Don't chase points!" → "dont-chase-points". */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
