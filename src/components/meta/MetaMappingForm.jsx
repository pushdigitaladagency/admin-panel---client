'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FileText, ImagePlus, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CountedField } from '@/components/ui/CountedField';
import MediaSelectModal from '@/components/media/MediaSelectModal';
import { resolveUploadUrl } from '@/components/ui/UploadField';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';
import { notOnlySpecial, isUrl, isUrlOrPath } from '@/lib/validators';

const TWITTER_CARDS = ['Summary', 'Summary Large Image'];
const ROBOTS = ['index, follow', 'noindex, nofollow'];
const IMAGE_TYPES = ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF', 'SVG'];

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

export function MetaMappingForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [ogImage, setOgImage] = React.useState(initialData?.og_image || '');
  const [twitterImage, setTwitterImage] = React.useState(initialData?.twitter_image || '');
  
  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false);
  const [mediaTarget, setMediaTarget] = React.useState(null);

  const {
    register,
    handleSubmit,
    control,
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

    if (!IMAGE_TYPES.includes(selectedType)) {
      addToast('Only image files are allowed', 'danger');
      return;
    }

    if (mediaTarget === 'ogImage') {
      setOgImage(selectedPath);
    } else if (mediaTarget === 'twitterImage') {
      setTwitterImage(selectedPath);
    }

    closeMediaPicker();
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
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="card">
          <div className="card-header"><h3 className="card-title">Page & Meta</h3></div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CountedField control={control} register={register} errors={errors} name="page_name" label="Page Name" limit={255} required rules={{ required: 'Page name is required', validate: notOnlySpecial }} />
              <CountedField control={control} register={register} errors={errors} name="url" label="URL" limit={500} required placeholder="/about-us" rules={{ required: 'URL is required', validate: isUrlOrPath }} />
              <CountedField control={control} register={register} errors={errors} name="meta_title" label="Meta Title" limit={255} required rules={{ required: 'Meta title is required' }} />
              <CountedField control={control} register={register} errors={errors} name="canonical_url" label="Canonical URL" limit={500} rules={{ validate: isUrl }} />
              <div className="form-group">
                <label className="form-label">Robots</label>
                <select className="form-select" {...register('robots')}>{ROBOTS.map((r) => <option key={r}>{r}</option>)}</select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" {...register('status')}><option>Active</option><option>Inactive</option></select>
              </div>
            </div>
            <CountedField control={control} register={register} errors={errors} name="meta_keywords" label="Meta Keywords" multiline />
            <CountedField control={control} register={register} errors={errors} name="meta_description" label="Meta Description" required multiline rules={{ required: 'Meta Description is required' }} />
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">Open Graph</h3></div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CountedField control={control} register={register} errors={errors} name="og_title" label="OG Title" limit={255} />
              <CountedField control={control} register={register} errors={errors} name="og_type" label="OG Type" limit={100} />
              <CountedField control={control} register={register} errors={errors} name="og_url" label="OG URL" limit={500} rules={{ validate: isUrl }} />
              <FormMediaField
                label="OG Image"
                value={ogImage}
                onOpen={() => openMediaPicker('ogImage')}
                onClear={() => setOgImage('')}
              />
            </div>
            <CountedField control={control} register={register} errors={errors} name="og_description" label="OG Description" multiline />
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
              <CountedField control={control} register={register} errors={errors} name="twitter_title" label="Twitter Title" limit={255} />
              <FormMediaField
                label="Twitter Image"
                value={twitterImage}
                onOpen={() => openMediaPicker('twitterImage')}
                onClear={() => setTwitterImage('')}
              />
            </div>
            <CountedField control={control} register={register} errors={errors} name="twitter_description" label="Twitter Description" multiline />
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

      <MediaSelectModal
        isOpen={isMediaModalOpen}
        onClose={closeMediaPicker}
        onSelect={handleMediaSelect}
        multiple={false}
      />
    </>
  );
}
