'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UploadField } from '@/components/ui/UploadField';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

const STATUSES = ['Draft', 'Published', 'Archived'];
const toNum = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
const dateOnly = (v) => (v ? String(v).split('T')[0] : '');

export function InvestorDocumentForm({ initialData, categories = [] }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [pdf, setPdf] = React.useState(initialData?.pdf_file || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      category_id: initialData?.category_id ? String(initialData.category_id) : '',
      financial_year: initialData?.financial_year || '',
      description: initialData?.description || '',
      publish_date: dateOnly(initialData?.publish_date),
      featured: initialData?.featured || 'No',
      display_order: initialData?.display_order ?? 0,
      status: initialData?.status || 'Draft',
      meta_title: initialData?.meta_title || '',
      meta_keywords: initialData?.meta_keywords || '',
      meta_description: initialData?.meta_description || '',
      canonical_url: initialData?.canonical_url || '',
    },
  });

  const onSubmit = async (data) => {
    if (!pdf) {
      addToast('PDF file is required', 'danger');
      return;
    }
    const payload = {
      ...data,
      slug: data.slug || undefined,
      category_id: toNum(data.category_id),
      display_order: toNum(data.display_order) ?? 0,
      pdf_file: pdf,
    };
    try {
      if (isEdit) {
        await api.put(`/investor-documents/${initialData.id}`, payload);
        addToast('Document updated successfully', 'success');
      } else {
        await api.post('/investor-documents', payload);
        addToast('Document created successfully', 'success');
      }
      router.push('/investor-documents');
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
      <div className="card">
        <div className="card-header"><h3 className="card-title">Document Details</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('title', 'Title', { required: true, rules: { required: 'Title is required' } })}
            {field('slug', 'Slug')}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className={`form-select ${errors.category_id ? 'error' : ''}`} {...register('category_id', { required: 'Category is required' })}>
                <option value="">Select category…</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.category_name}</option>)}
              </select>
              {errors.category_id && <p className="form-error">{errors.category_id.message}</p>}
            </div>
            {field('financial_year', 'Financial Year', { required: true, rules: { required: 'Financial year is required' }, })}
            {field('publish_date', 'Publish Date', { type: 'date', required: true, rules: { required: 'Publish date is required' } })}
            {field('display_order', 'Display Order', { type: 'number' })}
            <div className="form-group">
              <label className="form-label">Featured</label>
              <select className="form-select" {...register('featured')}><option>No</option><option>Yes</option></select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" {...register('status')}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" style={{ minHeight: 80 }} {...register('description')} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">File</h3></div>
        <div className="card-body">
          <UploadField label="PDF File *" accept=".pdf" value={pdf} onChange={setPdf} preview={false} />
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">SEO</h3></div>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
          {field('meta_title', 'Meta Title')}
             {field('canonical_url', 'Canonical URL')}
          <div className="form-group"><label className="form-label">Meta Keywords</label><textarea className="form-textarea" {...register('meta_keywords')} /></div>
          <div className="form-group"><label className="form-label">Meta Description</label><textarea className="form-textarea" {...register('meta_description')} /></div>
      
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}</Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/investor-documents')}>Cancel</Button>
      </div>
    </form>
  );
}
