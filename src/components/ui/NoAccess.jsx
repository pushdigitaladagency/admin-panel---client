'use client';

import React from 'react';
import { Lock } from 'lucide-react';

// Shown in place of a list/empty-state when the current user lacks the required
// permission for a module. Surfaces the action + module so it's clear what's missing.
export function NoAccess({ module, action = 'view' }) {
  return (
    <div className="card">
      <div className="card-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <Lock size={32} className="text-muted" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.6 }} />
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>
          You don&apos;t have access to <strong>{action}</strong> the <strong>{module}</strong> module.
        </p>
      </div>
    </div>
  );
}
