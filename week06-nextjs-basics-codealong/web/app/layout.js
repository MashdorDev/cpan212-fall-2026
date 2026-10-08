import Link from 'next/link';
import './globals.css';
import styles from './layout.module.css';

export const metadata = {
  title: {
    default: 'Campus Events',
    template: '%s | Campus Events',
  },
  description: 'What is happening on campus this term',
};

// The root layout wraps every page. The header stays on screen while Link swaps the page below it.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>
            Campus Events
          </Link>
          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/events">Events</Link>
          </nav>
        </header>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
