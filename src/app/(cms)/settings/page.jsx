'use client';

import React from 'react';
import { SettingsForm } from '@/components/settings/SettingsForm';
import { useApi } from '@/lib/useApi';

export default function SettingsPage() {
  const { data: settings, loading, error } = useApi('/settings');

  if (loading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading settings…</p>;
  if (error) return <p className="form-error" style={{ padding: '32px 0' }}>{error.message || 'Failed to load settings'}</p>;
  if (!settings) return <p className="text-muted" style={{ padding: '32px 0' }}>No settings found.</p>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Global Settings</h1>
          <p className="page-subtitle">Configure system-wide settings and options</p>
        </div>
      </div>
      
      <SettingsForm initialSettings={settings} />
    </>
  );
}
