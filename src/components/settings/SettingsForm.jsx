'use client';

import React from 'react';
import { useForm } from 'react-hook-form';


import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

export function SettingsForm({ initialSettings = {} }) {
  const { addToast } = useToast();

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* General Settings */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">General Settings</h3>
        </div>
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
        <div className="card-header">
          <h3 className="card-title">SEO Settings</h3>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Default SEO Title</label>
            <Input
              {...register('settings.seo_default_title')}
              placeholder="Default title"
            />
          </div>
          <div className="form-group">
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
      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
