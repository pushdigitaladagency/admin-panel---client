'use client';

import React from 'react';
import { GlobalSettingsForm } from '@/components/settings/GlobalSettingsForm';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function GlobalSettingsPage() {
  const { can } = useAuth();
  const canView = can('global_settings', 'view');
  const { data, loading, error } = useApi('/global-settings', { enabled: canView });

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Global Settings</h1>
          <p className="page-subtitle">Site-wide configuration</p>
        </div>
      </div>

      {(!canView || error?.status === 403) ? (
        <NoAccess module="global_settings" action="view" />
      ) : error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load settings'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading settings…</p>
      ) : (
        <GlobalSettingsForm initialData={data} />
      )}
    </>
  );
}
