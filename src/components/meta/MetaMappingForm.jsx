'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UploadField } from '@/components/ui/UploadField';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

const TWITTER_CARDS = ['Summary', 'Summary Large Image'];
const ROBOTS = ['index, follow', 'noindex, nofollow'];

export function MetaMappingForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [ogImage, setOgImage] = React.useState(initialData?.og_image || '');
  const [twitterImage, setTwitterImage] = React.useState(initialData?.twitter_image || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      page_name: initialData?.page_name || '',
      url: initialData?.url || '',
      meta_title: initialData?.meta_title || '',
      meta_keywords: initialData?.meta_keywords || '',
      meta_description: initialData?.meta_description || '',
      canonical_url: initialData?.canonical_url || '',
      og_title: initialData?.og_title || '',
      og_description: initialData?.og_description || '',
      og_type: initialData?.og_type || 'website',
      og_url: initialData?.og_url || '',
      twitter_card: initialData?.twitter_card || 'Summary',
      twitter_title: initialData?.twitter_title || '',
      twitter_description: initialData?.twitter_description || '',
      robots: initialData?.robots || 'index, follow',
      schema_markup: initialData?.schema_markup || '',
      header_scripts: initialData?.header_scripts || '',
      footer_scripts: initialData?.footer_scripts || '',
      status: initialData?.status || 'Active',
    },
  });

  const onSubmit = async (data) => {
    const payload = { ...data, og_image: ogImage || null, twitter_image: twitterImage || null };
    try {
      if (isEdit) {
        await api.put(`/meta-mappings/${initialData.id}`, payload);
        addToast('Meta mapping updated successfully', 'success');
      } else {
        await api.post('/meta-mappings', payload);
        addToast('Meta mapping created successfully', 'success');
      }
      router.push('/meta-mappings');
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  const field = (name, label, opts = {}) => (
    <div className="form-group">
      <label className="form-label">{label}{opts.required && ' *'}</label>
      <Input type={opts.type || 'text'} {...register(name, opts.rules)} placeholder={opts.placeholder} className={errors[name] ? 'error' : ''} />
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );

  const textArea = (name, label, required, mono) => (
    <div className="form-group">
      <label className="form-label">{label}{required && ' *'}</label>
      <textarea
        className={`form-textarea ${errors[name] ? 'error' : ''}`}
        style={{ minHeight: 80, fontFamily: mono ? 'monospace' : undefined }}
        {...register(name, required ? { required: `${label} is required` } : {})}
      />
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="card">
        <div className="card-header"><h3 className="card-title">Page & Meta</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('page_name', 'Page Name', { required: true, rules: { required: 'Page name is required' } })}
            {field('url', 'URL', { required: true, rules: { required: 'URL is required' }, placeholder: '/about-us' })}
            {field('meta_title', 'Meta Title', { required: true, rules: { required: 'Meta title is required' } })}
            {field('canonical_url', 'Canonical URL')}
            <div className="form-group">
              <label className="form-label">Robots</label>
              <select className="form-select" {...register('robots')}>{ROBOTS.map((r) => <option key={r}>{r}</option>)}</select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" {...register('status')}><option>Active</option><option>Inactive</option></select>
            </div>
          </div>
          {textArea('meta_keywords', 'Meta Keywords')}
          {textArea('meta_description', 'Meta Description', true)}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Open Graph</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('og_title', 'OG Title')}
            {field('og_type', 'OG Type')}
            {field('og_url', 'OG URL')}
            <UploadField label="OG Image" accept="image/*" value={ogImage} onChange={setOgImage} />
          </div>
          {textArea('og_description', 'OG Description')}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Twitter</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Twitter Card</label>
              <select className="form-select" {...register('twitter_card')}>{TWITTER_CARDS.map((t) => <option key={t}>{t}</option>)}</select>
            </div>
            {field('twitter_title', 'Twitter Title')}
            <UploadField label="Twitter Image" accept="image/*" value={twitterImage} onChange={setTwitterImage} />
          </div>
          {textArea('twitter_description', 'Twitter Description')}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Advanced</h3></div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {textArea('schema_markup', 'Schema Markup (JSON-LD)', false, true)}
          {textArea('header_scripts', 'Header Scripts', false, true)}
          {textArea('footer_scripts', 'Footer Scripts', false, true)}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}</Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/meta-mappings')}>Cancel</Button>
      </div>
    </form>
  );
}
