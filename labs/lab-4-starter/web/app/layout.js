import './globals.css';

export const metadata = {
  title: 'Plant Shelf',
  description: 'CPAN 212 Lab 4: track when your plants need water',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
