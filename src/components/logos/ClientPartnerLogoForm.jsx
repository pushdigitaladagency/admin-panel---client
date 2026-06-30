'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UploadField } from '@/components/ui/UploadField';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

const CATEGORIES = ['Client', 'Partner', 'Sponsor'];
const toNum = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

export function ClientPartnerLogoForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [logo, setLogo] = React.useState(initialData?.logo_image || '');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      client_partner_name: initialData?.client_partner_name || '',
      category: initialData?.category || 'Client',
      website_url: initialData?.website_url || '',
      short_description: initialData?.short_description || '',
      alt_text: initialData?.alt_text || '',
      display_order: initialData?.display_order ?? 0,
      featured: initialData?.featured || 'No',
      status: initialData?.status || 'Active',
      meta_title: initialData?.meta_title || '',
      meta_description: initialData?.meta_description || '',
    },
  });

  const featuredVal = useWatch({ control, name: 'featured', defaultValue: initialData?.featured || 'No' });
  const statusVal   = useWatch({ control, name: 'status',   defaultValue: initialData?.status   || 'Active' });

  const onSubmit = async (data) => {
    if (!logo) {
      addToast('Logo image is required', 'danger');
      return;
    }
    const payload = { ...data, logo_image: logo, display_order: toNum(data.display_order) ?? 0 };
    try {
      if (isEdit) {
        await api.put(`/client-partner-logos/${initialData.id}`, payload);
        addToast('Logo updated successfully', 'success');
      } else {
        await api.post('/client-partner-logos', payload);
        addToast('Logo created successfully', 'success');
      }
      router.push('/client-partner-logos');
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  const field = (name, label, opts = {}) => (
    <div className="form-group">
      <label className="form-label">{label}{opts.required && ' *'}</label>
      <Input type={opts.type || 'text'} {...register(name, opts.rules)} className={errors[name] ? 'error' : ''} />
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Details Summary — colored badges only here */}
      {isEdit && (
        <div className="card">
          <div className="card-header"><h3 className="card-title">Details</h3></div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="form-label" style={{ marginBottom: 0 }}>Featured</span>
                <span className={`badge ${featuredVal === 'Yes' ? 'badge-success' : 'badge-danger'}`}>
                  {featuredVal || 'No'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="form-label" style={{ marginBottom: 0 }}>Status</span>
                <span className={`badge ${statusVal === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                  {statusVal || 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header"><h3 className="card-title">Logo Details</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('client_partner_name', 'Name', { required: true, rules: { required: 'Name is required' } })}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-select" {...register('category', { required: true })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
            </div>
            {field('website_url', 'Website URL')}
            {field('alt_text', 'Alt Text')}
            {field('display_order', 'Display Order', { type: 'number' })}
            <div className="form-group">
              <label className="form-label">Featured</label>
              <select className="form-select" {...register('featured')}>
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" {...register('status')}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Short Description</label>
            <textarea className="form-textarea" style={{ minHeight: 80 }} {...register('short_description')} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Logo Image</h3></div>
        <div className="card-body">
          <UploadField label="Logo Image *" accept="image/*" value={logo} onChange={setLogo} />
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">SEO</h3></div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {field('meta_title', 'Meta Title')}
          <div className="form-group"><label className="form-label">Meta Description</label><textarea className="form-textarea" {...register('meta_description')} /></div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}</Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/client-partner-logos')}>Cancel</Button>
      </div>
    </form>
  );
}
