'use client';

import React from 'react';
import { ImagePlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export function AlbumForm({ categories = [], events = [], initialData, onSubmit, onCancel }) {
  const isEdit = !!initialData;

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseHost = (process.env.NEXT_PUBLIC_API_URL || 'http://63.141.242.203:6001/api').replace(/\/api$/, '');
    return `${baseHost}/${path.replace(/^\/?/, '')}`;
  };

  const [preview, setPreview] = React.useState(initialData?.cover_image ? getImageUrl(initialData.cover_image) : null);
  const [fileName, setFileName] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      category_id: initialData?.category_id ? String(initialData.category_id) : '',
      description: initialData?.description || '',
      event_id: initialData?.event_id ? String(initialData.event_id) : '',
      status: (initialData?.status === true || initialData?.status === 'Active' || initialData?.status === undefined) ? 'Active' : 'Inactive',
    },
  });

  const coverImageRegister = register('cover_image', isEdit ? {} : { required: 'Cover Image is required' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <div className="form-group">
        <label className="form-label">
          Album Title <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
        </label>
        <Input
          {...register('title', { required: 'Album Title is required' })}
          placeholder="e.g. Annual Summit 2026 Photos"
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Album Category</label>
        <Select {...register('category_id')}>
          <option value="">None / Select Category...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          {...register('description')}
          className="form-textarea"
          placeholder="Describe the album contents..."
          style={{ minHeight: '80px' }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Cover Image {!isEdit && <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
        <input
          type="file"
          id="album-cover-input"
          accept="image/*"
          {...coverImageRegister}
          style={{ display: 'none' }}
          onChange={(e) => {
            coverImageRegister.onChange(e);
            const file = e.target.files?.[0];
            if (file) {
              setFileName(file.name);
              const reader = new FileReader();
              reader.onload = (re) => setPreview(re.target.result);
              reader.readAsDataURL(file);
            }
          }}
        />
        <div
          onClick={() => document.getElementById('album-cover-input').click()}
          className={`premium-dropzone ${errors.cover_image ? 'error' : ''}`}
          style={{ minHeight: '100px', cursor: 'pointer' }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{ 
                maxHeight: '60px', 
                borderRadius: 'var(--radius-sm)', 
                marginBottom: '8px'
              }}
            />
          ) : (
            <ImagePlus size={28} className="premium-dropzone-icon" />
          )}
          <span className="premium-dropzone-text">
            {fileName || (preview ? 'Change cover image' : 'Select cover image')}
          </span>
        </div>
        {errors.cover_image && <p className="form-error">{errors.cover_image.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Event Reference</label>
        <Select {...register('event_id')}>
          <option value="">None</option>
          {events.map((evt) => (
            <option key={evt.id} value={evt.id}>
              {evt.title}
            </option>
          ))}
        </Select>
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <Select {...register('status')}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border" style={{ borderColor: 'var(--color-border)' }}>
        <Button type="submit" variant="primary">
          {isEdit ? 'Save' : 'Create Album'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
