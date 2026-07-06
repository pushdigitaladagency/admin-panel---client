'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { TermsProvider } from '@/context/TermsContext';
import { ConfirmProvider } from '@/context/ConfirmContext';
import { useAuth } from '@/context/AuthContext';

// Shows a one-time success toast right after a fresh sign-in.
function LoginSuccessToast() {
  const { addToast } = useToast();
  useEffect(() => {
    let flagged = false;
    try {
      flagged = sessionStorage.getItem('loginSuccess') === '1';
      if (flagged) sessionStorage.removeItem('loginSuccess');
    } catch {}
    if (flagged) addToast('Logged in successfully', 'success');
  }, [addToast]);
  return null;
}

export default function CmsLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Hold rendering until auth is resolved / redirect completes, so the
  // protected shell never flashes for signed-out users. (No layout change.)
  if (loading || !isAuthenticated) return null;

  return (
    <ToastProvider>
      <LoginSuccessToast />
      <TermsProvider>
        <ConfirmProvider>
          <div className="app-shell">
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <div className="main-wrapper">
              <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main className="page-content">{children}</main>
            </div>
          </div>
        </ConfirmProvider>
      </TermsProvider>
    </ToastProvider>
  );
}
