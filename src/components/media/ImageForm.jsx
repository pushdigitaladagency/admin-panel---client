'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export function ImageForm({ albums = [], initialData, onSubmit, onCancel }) {
  const isEdit = !!initialData;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      album_id: initialData?.album_id || '',
      title: initialData?.title || '',
      caption: initialData?.caption || '',
      alt_text: initialData?.alt_text || '',
      display_order: initialData?.display_order || '0',
      status: initialData?.status || 'Active',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <div className="form-group">
        <label className="form-label">
          Album <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
        </label>
        <Select 
          {...register('album_id', { required: 'Album selection is required' })}
          className={errors.album_id ? 'error' : ''}
        >
          <option value="">Select Album...</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </Select>
        {errors.album_id && <p className="form-error">{errors.album_id.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">
          Image Upload {!isEdit && <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
        {isEdit && initialData.image_url && (
          <div className="mb-2 flex items-center gap-2">
            <img src={initialData.image_url} alt="Current thumbnail" className="w-12 h-12 object-cover rounded" />
            <span className="text-xs text-muted">Current image</span>
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          {...register('image_file', isEdit ? {} : { required: 'Image upload is required' })}
          style={{ padding: '7px 14px' }}
          className={errors.image_file ? 'error' : ''}
        />
        {errors.image_file && <p className="form-error">{errors.image_file.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Image Title</label>
        <Input
          {...register('title')}
          placeholder="e.g. Keynote Presentation Stage"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Caption</label>
        <textarea
          {...register('caption')}
          className="form-textarea"
          placeholder="Optional caption details..."
          style={{ minHeight: '60px' }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Alt Text</label>
        <Input
          {...register('alt_text')}
          placeholder="e.g. Speakers presenting on stage under main banner"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Display Order</label>
        <Input
          type="number"
          {...register('display_order')}
          placeholder="e.g. 1, 2, 3"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <Select {...register('status')}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border" style={{ borderColor: 'var(--color-border)' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {isEdit ? 'Save Changes' : 'Upload Image'}
        </Button>
      </div>
    </form>
  );
}
