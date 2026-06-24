import './globals.css';

export const metadata = {
  title: 'CMS Dashboard',
  description: 'Content Management System — Next.js 15',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
