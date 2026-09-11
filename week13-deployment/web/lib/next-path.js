// Where to send the user after logging in, from ?next=/events/new.
// Only paths on this site are allowed. "//evil.example" and "/\evil.example" look like paths but browsers
// treat them as other sites, so a crafted login link could otherwise send someone to a fake page.
export function safeNextPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return '/events';
  }
  return value;
}
