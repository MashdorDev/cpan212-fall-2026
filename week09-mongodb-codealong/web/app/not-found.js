import Link from 'next/link';

// Shown for any URL that doesn't match a page, and whenever a page calls notFound().
export default function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>That page or event does not exist. The event may have been removed.</p>
      <Link href="/events">See all events</Link>
    </section>
  );
}
