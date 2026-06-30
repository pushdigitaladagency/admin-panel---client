'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

const toNum = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

export function InvestorCategoryForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      category_name: initialData?.category_name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      display_order: initialData?.display_order ?? 0,
      status: initialData?.status || 'Active',
      meta_title: initialData?.meta_title || '',
      meta_keywords: initialData?.meta_keywords || '',
      meta_description: initialData?.meta_description || '',
      canonical_url: initialData?.canonical_url || '',
    },
  });

  const onSubmit = async (data) => {
    const payload = { ...data, slug: data.slug || undefined, display_order: toNum(data.display_order) ?? 0 };
    try {
      if (isEdit) {
        await api.put(`/investor-categories/${initialData.id}`, payload);
        addToast('Category updated successfully', 'success');
      } else {
        await api.post('/investor-categories', payload);
        addToast('Category created successfully', 'success');
      }
      router.push('/investor-categories');
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
        <div className="card-header"><h3 className="card-title">Category Details</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('category_name', 'Category Name', { required: true, rules: { required: 'Name is required' } })}
            {field('slug', 'Slug')}
            {field('display_order', 'Display Order', { type: 'number' })}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" {...register('status')}><option>Active</option><option>Inactive</option></select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" style={{ minHeight: 80 }} {...register('description')} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">SEO</h3></div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {field('meta_title', 'Meta Title')}
          <div className="form-group"><label className="form-label">Meta Keywords</label><textarea className="form-textarea" {...register('meta_keywords')} /></div>
          <div className="form-group"><label className="form-label">Meta Description</label><textarea className="form-textarea" {...register('meta_description')} /></div>
          {field('canonical_url', 'Canonical URL')}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}</Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/investor-categories')}>Cancel</Button>
      </div>
    </form>
  );
}
