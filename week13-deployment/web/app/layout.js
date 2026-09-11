import Link from 'next/link';
import { AuthProvider } from '@/components/AuthProvider';
import { SavedEventsProvider } from '@/components/SavedEventsProvider';
import UserMenu from '@/components/UserMenu';
import './globals.css';
import styles from './layout.module.css';

export const metadata = {
  title: {
    default: 'Campus Events',
    template: '%s | Campus Events',
  },
  description: 'What is happening on campus this term',
};

// The layout is a Server Component, and it can still render Client Components (the providers)
// around the pages. Every page and component inside can then call useAuth() and useSavedEvents().
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
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
              <UserMenu />
            </header>
            <main className={styles.main}>{children}</main>
          </SavedEventsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
