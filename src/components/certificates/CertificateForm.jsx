'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FileText, ImagePlus, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import MediaSelectModal from '@/components/media/MediaSelectModal';
import { CountedField } from '@/components/ui/CountedField';
import { resolveUploadUrl } from '@/components/ui/UploadField';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';
import { notOnlySpecial, isUrl } from '@/lib/validators';

const STATUSES = ['Active', 'Inactive', 'Expired'];
const IMAGE_TYPES = ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF', 'SVG'];
const toNum = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
const dateOnly = (v) => (v ? String(v).split('T')[0] : '');
const fileNameFromPath = (path) => (path ? String(path).split('/').pop() : '');
const fileTypeFromPath = (path) => (path ? fileNameFromPath(path).split('.').pop().toUpperCase() : '');

function CertificateMediaField({ label, value, onOpen, onClear, preview = true }) {
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

export function CertificateForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [image, setImage] = React.useState(initialData?.certificate_image || '');
  const [pdf, setPdf] = React.useState(initialData?.pdf_attachment || '');
  const [thumb, setThumb] = React.useState(initialData?.thumbnail_image || '');
  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false);
  const [mediaTarget, setMediaTarget] = React.useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
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

  const certificateTitleVal = watch('certificate_title');

  React.useEffect(() => {
    if (certificateTitleVal !== undefined) {
      const generatedSlug = certificateTitleVal
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true, shouldDirty: true });
    }
  }, [certificateTitleVal, setValue, isEdit]);

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
      <Input type={opts.type || 'text'} min={opts.min} {...register(name, opts.rules)} className={errors[name] ? 'error' : ''} />
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );

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

    if (mediaTarget === 'certificate') {
      if (!IMAGE_TYPES.includes(selectedType)) {
        addToast('Only image files are allowed for Certificate Image', 'danger');
        return;
      }
      setImage(selectedPath);
    } else if (mediaTarget === 'thumbnail') {
      if (!IMAGE_TYPES.includes(selectedType)) {
        addToast('Only image files are allowed for Thumbnail Image', 'danger');
        return;
      }
      setThumb(selectedPath);
    } else if (mediaTarget === 'pdf') {
      if (selectedType !== 'PDF') {
        addToast('Only PDF files are allowed for PDF Attachment', 'danger');
        return;
      }
      setPdf(selectedPath);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="card">
          <div className="card-header"><h3 className="card-title">Certificate Details</h3></div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('certificate_title', 'Certificate Title', { required: true, rules: { required: 'Title is required', validate: notOnlySpecial } })}
              {field('slug', 'Slug')}
              {field('certificate_number', 'Certificate Number', { required: true, rules: { required: 'Number is required' } })}
              {field('issuing_authority', 'Issuing Authority', { required: true, rules: { required: 'Issuing authority is required' } })}
              {field('issue_date', 'Issue Date', { type: 'date', required: true, rules: { required: 'Issue date is required' } })}
              {field('expiry_date', 'Expiry Date', { type: 'date' })}
              {field('display_order', 'Display Order', { type: 'number', min: 0, rules: { min: { value: 0, message: 'Display Order cannot be negative' } } })}
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
              <CertificateMediaField
                label="Certificate Image *"
                value={image}
                onOpen={() => openMediaPicker('certificate')}
                onClear={() => setImage('')}
              />
              <CertificateMediaField
                label="Thumbnail Image"
                value={thumb}
                onOpen={() => openMediaPicker('thumbnail')}
                onClear={() => setThumb('')}
              />
              <CertificateMediaField
                label="PDF Attachment"
                value={pdf}
                preview={false}
                onOpen={() => openMediaPicker('pdf')}
                onClear={() => setPdf('')}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">SEO</h3></div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
            <CountedField control={control} register={register} errors={errors} name="meta_title" label="Meta Title" limit={255} />
            <CountedField control={control} register={register} errors={errors} name="canonical_url" label="Canonical URL" limit={500} rules={{ validate: isUrl }} />
            <CountedField control={control} register={register} errors={errors} name="meta_description" label="Meta Description" multiline />
            <CountedField control={control} register={register} errors={errors} name="meta_keywords" label="Meta Keywords" multiline />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/certificates')}>Cancel</Button>
        </div>
      </form>

      <MediaSelectModal
        isOpen={isMediaModalOpen}
        onClose={closeMediaPicker}
        onSelect={handleMediaSelect}
        source={mediaTarget === 'pdf' ? 'uploads' : 'gallery'}
        accept={mediaTarget === 'pdf' ? '.pdf,application/pdf' : 'image/*'}
        allowedTypes={mediaTarget === 'pdf' ? ['PDF'] : IMAGE_TYPES}
        invalidFileMessage={mediaTarget === 'pdf' ? 'Only PDF files are allowed for PDF Attachment' : 'Only image files are allowed'}
        emptyMessage={mediaTarget === 'pdf' ? 'No PDF files found' : 'No images found'}
      />
    </>
  );
}
