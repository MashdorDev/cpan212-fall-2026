import Link from 'next/link';
import { SavedEventsProvider } from '@/components/SavedEventsProvider';
import './globals.css';
import styles from './layout.module.css';

export const metadata = {
  title: {
    default: 'Campus Events',
    template: '%s | Campus Events',
  },
  description: 'What is happening on campus this term',
};

// The layout is a Server Component, and it can still render a Client Component (the provider)
// around the pages. Every page and component inside can then call useSavedEvents().
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SavedEventsProvider>
          <header className={styles.header}>
            <Link href="/" className={styles.brand}>
              Campus Events
            </Link>
            <nav className={styles.nav}>
              <Link href="/events">Events</Link>
              <Link href="/events/new">New event</Link>
              <Link href="/saved">Saved</Link>
            </nav>
          </header>
          <main className={styles.main}>{children}</main>
        </SavedEventsProvider>
      </body>
    </html>
  );
}
