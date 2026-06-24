'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { ToastProvider } from '@/components/ui/Toast';
import { TermsProvider } from '@/context/TermsContext';

export default function CmsLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <TermsProvider>
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
      </TermsProvider>
    </ToastProvider>
  );
}
