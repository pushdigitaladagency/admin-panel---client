import React from 'react';
import { SettingsForm } from '@/components/settings/SettingsForm';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  // Mock data
  const settings = {
    site_name: 'Mock CMS',
    site_description: 'This is a pure frontend template',
    contact_email: 'admin@mockcms.com',
    seo_default_title: 'Mock CMS - Welcome',
    seo_default_description: 'Welcome to the mock CMS dashboard',
  };

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
