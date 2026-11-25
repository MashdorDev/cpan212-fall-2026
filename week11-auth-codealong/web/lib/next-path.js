// Where to go after logging in, from a link like /login?next=/events/new.
// Only paths on this site are allowed. "//evil.example" starts with a / too, but the browser
// treats it as another website, so a crafted login link could send people to a fake page.
export function safeNextPath(next) {
  if (typeof next !== 'string') {
    return '/events';
  }
  if (!next.startsWith('/') || next.startsWith('//')) {
    return '/events';
  }
  // Browsers drop tabs and line breaks from a URL and read \ as /, so "/<tab>/evil.example"
  // and "/\evil.example" also turn into //evil.example. A real path never has them.
  for (const character of next) {
    if (character === '\\' || character < ' ') {
      return '/events';
    }
  }
  return next;
}
