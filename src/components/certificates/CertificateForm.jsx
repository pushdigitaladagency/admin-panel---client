'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UploadField } from '@/components/ui/UploadField';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

const STATUSES = ['Active', 'Inactive', 'Expired'];
const toNum = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
const dateOnly = (v) => (v ? String(v).split('T')[0] : '');

export function CertificateForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [image, setImage] = React.useState(initialData?.certificate_image || '');
  const [pdf, setPdf] = React.useState(initialData?.pdf_attachment || '');
  const [thumb, setThumb] = React.useState(initialData?.thumbnail_image || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      certificate_title: initialData?.certificate_title || '',
      slug: initialData?.slug || '',
      certificate_number: initialData?.certificate_number || '',
      issuing_authority: initialData?.issuing_authority || '',
      issue_date: dateOnly(initialData?.issue_date),
      expiry_date: dateOnly(initialData?.expiry_date),
      description: initialData?.description || '',
      display_order: initialData?.display_order ?? 0,
      featured: initialData?.featured || 'No',
      alt_text: initialData?.alt_text || '',
      meta_title: initialData?.meta_title || '',
      meta_keywords: initialData?.meta_keywords || '',
      meta_description: initialData?.meta_description || '',
      canonical_url: initialData?.canonical_url || '',
      status: initialData?.status || 'Active',
    },
  });

  const onSubmit = async (data) => {
    if (!image) {
      addToast('Certificate image is required', 'danger');
      return;
    }
    const payload = {
      ...data,
      slug: data.slug || undefined,
      display_order: toNum(data.display_order) ?? 0,
      certificate_image: image,
      pdf_attachment: pdf || null,
      thumbnail_image: thumb || null,
      expiry_date: data.expiry_date || null,
    };
    try {
      if (isEdit) {
        await api.put(`/certificates/${initialData.id}`, payload);
        addToast('Certificate updated successfully', 'success');
      } else {
        await api.post('/certificates', payload);
        addToast('Certificate created successfully', 'success');
      }
      router.push('/certificates');
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
        <div className="card-header"><h3 className="card-title">Certificate Details</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('certificate_title', 'Certificate Title', { required: true, rules: { required: 'Title is required' } })}
            {field('slug', 'Slug')}
            {field('certificate_number', 'Certificate Number', { required: true, rules: { required: 'Number is required' } })}
            {field('issuing_authority', 'Issuing Authority', { required: true, rules: { required: 'Issuing authority is required' } })}
            {field('issue_date', 'Issue Date', { type: 'date', required: true, rules: { required: 'Issue date is required' } })}
            {field('expiry_date', 'Expiry Date', { type: 'date' })}
            {field('display_order', 'Display Order', { type: 'number' })}
            <div className="form-group">
              <label className="form-label">Featured</label>
              <select className="form-select" {...register('featured')}><option>No</option><option>Yes</option></select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" {...register('status')}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            </div>
            {field('alt_text', 'Alt Text')}
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" style={{ minHeight: 90 }} {...register('description')} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Media</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UploadField label="Certificate Image *" accept="image/*" value={image} onChange={setImage} />
            <UploadField label="Thumbnail Image" accept="image/*" value={thumb} onChange={setThumb} />
            <UploadField label="PDF Attachment" accept=".pdf" value={pdf} onChange={setPdf} preview={false} />
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
        <Button type="button" variant="secondary" onClick={() => router.push('/certificates')}>Cancel</Button>
      </div>
    </form>
  );
}
