import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'CMS Dashboard',
  description: 'Content Management System — Next.js 15',
  icons: {
    icon: '/sidebar-logo.svg',
    shortcut: '/sidebar-logo.svg',
    apple: '/sidebar-logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
