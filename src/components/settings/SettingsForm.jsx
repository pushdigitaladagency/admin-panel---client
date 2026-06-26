'use client';

import React from 'react';
import { useForm } from 'react-hook-form';


import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function SettingsForm({ initialSettings = {} }) {
  const { addToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { settings: initialSettings },
  });

  const onSubmit = async (data) => {
    try {
      await api.put('/settings', data.settings);
      addToast('Settings saved successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save settings', 'danger');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* General Settings */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Site Name</label>
              <Input
                {...register('settings.site_name')}
                placeholder="My CMS Dashboard"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Site Description</label>
              <Input
                {...register('settings.site_description')}
                placeholder="A brief description of your site"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <Input
                type="email"
                {...register('settings.contact_email')}
                placeholder="admin@example.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="card">
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Default SEO Title</label>
            <Input
              {...register('settings.seo_default_title')}
              placeholder="Default title"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Default SEO Description</label>
            <textarea
              {...register('settings.seo_default_description')}
              className="form-textarea"
              placeholder="Default description"
              style={{ minHeight: '80px' }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          style={{ width: '80px', minWidth: '80px', height: '38px', padding: '0 18px' }}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/dashboard')}
          style={{ width: '80px', minWidth: '80px', height: '38px', padding: '0 18px' }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
