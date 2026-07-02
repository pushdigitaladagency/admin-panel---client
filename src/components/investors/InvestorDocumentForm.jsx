'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FileText, ImagePlus, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import MediaSelectModal from '@/components/media/MediaSelectModal';
import { resolveUploadUrl } from '@/components/ui/UploadField';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

const STATUSES = ['Draft', 'Published', 'Archived'];
const toNum = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
const dateOnly = (v) => (v ? String(v).split('T')[0] : '');

const fileNameFromPath = (path) => (path ? String(path).split('/').pop() : '');
const fileTypeFromPath = (path) => (path ? fileNameFromPath(path).split('.').pop().toUpperCase() : '');

function FormMediaField({ label, value, onOpen, onClear, preview = true }) {
  const fileName = fileNameFromPath(value);

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {value ? (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 14px', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)', background: 'var(--color-surface)',
          }}
        >
          {preview ? (
            <img src={resolveUploadUrl(value)} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
          ) : (
            <FileText size={22} className="text-muted" />
          )}
          <span style={{ flex: 1, fontSize: '0.8125rem', wordBreak: 'break-all' }}>{fileName}</span>
          
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClear} title="Remove">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="premium-dropzone"
          onClick={onOpen}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 6, padding: '18px', width: '100%', border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center',
          }}
        >
          {preview ? <ImagePlus size={26} className="text-muted" /> : <FileText size={26} className="text-muted" />}
          <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Select Media</span>
        </button>
      )}
    </div>
  );
}

export function InvestorDocumentForm({ initialData, categories = [] }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [pdf, setPdf] = React.useState(initialData?.pdf_file || '');
  
  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false);
  const [mediaTarget, setMediaTarget] = React.useState(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
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

  const titleVal = watch('title');

  React.useEffect(() => {
    if (titleVal !== undefined && !isEdit) {
      const generatedSlug = titleVal
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true, shouldDirty: true });
    }
  }, [titleVal, setValue, isEdit]);

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

  const openMediaPicker = (target) => {
    setMediaTarget(target);
    setIsMediaModalOpen(true);
  };

  const closeMediaPicker = () => {
    setIsMediaModalOpen(false);
    setMediaTarget(null);
  };

  const handleMediaSelect = (media) => {
    const selectedPath = media?.path || media?.url || '';
    if (!selectedPath) return;
    const selectedType = String(media?.type || fileTypeFromPath(selectedPath)).toUpperCase();

    if (mediaTarget === 'pdf') {
      if (selectedType !== 'PDF') {
        addToast('Only PDF files are allowed', 'danger');
        return;
      }
      setPdf(selectedPath);
    }

    closeMediaPicker();
  };

  const field = (name, label, opts = {}) => (
    <div className="form-group">
      <label className="form-label">{label}{opts.required && ' *'}</label>
      <Input type={opts.type || 'text'} min={opts.min} {...register(name, opts.rules)} className={errors[name] ? 'error' : ''} />
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );

  return (
    <>
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
              <div className="form-group">
                <label className="form-label">Publish Date *</label>
                <Input type="date" {...register('publish_date', { required: 'Publish date is required' })} className={errors.publish_date ? 'error' : ''} />
                {errors.publish_date && <p className="form-error">{errors.publish_date.message}</p>}
              </div>
              {field('display_order', 'Display Order', { type: 'number', min: 0, rules: { min: { value: 0, message: 'Display Order cannot be negative' } } })}
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
            <FormMediaField
              label="PDF File *"
              value={pdf}
              onOpen={() => openMediaPicker('pdf')}
              onClear={() => setPdf('')}
              preview={false}
            />
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

      <MediaSelectModal
        isOpen={isMediaModalOpen}
        onClose={closeMediaPicker}
        onSelect={handleMediaSelect}
        multiple={false}
        source="uploads"
        accept={mediaTarget === 'pdf' ? '.pdf,application/pdf' : 'image/*'}
        allowedTypes={mediaTarget === 'pdf' ? ['PDF'] : []}
        invalidFileMessage={mediaTarget === 'pdf' ? 'Only PDF files are allowed' : 'Invalid file type'}
        emptyMessage={mediaTarget === 'pdf' ? 'No PDF files found' : 'No files found'}
      />
    </>
  );
}
