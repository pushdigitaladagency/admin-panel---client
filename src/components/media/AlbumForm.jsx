'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export function AlbumForm({ initialData, onSubmit, onCancel }) {
  const isEdit = !!initialData;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      category: initialData?.category || '',
      description: initialData?.description || '',
      event_ref: initialData?.event_ref || '',
      status: initialData?.status || 'Active',
    },
  });

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
        <Input
          {...register('category')}
          placeholder="e.g. Conferences, Sports, Tech"
        />
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
        {isEdit && initialData.cover_image && (
          <div className="mb-2 flex items-center gap-2">
            <img src={initialData.cover_image} alt="Current cover" className="w-12 h-12 object-cover rounded" />
            <span className="text-xs text-muted">Current cover image</span>
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          {...register('cover_image', isEdit ? {} : { required: 'Cover Image is required' })}
          style={{ padding: '7px 14px' }}
          className={errors.cover_image ? 'error' : ''}
        />
        {errors.cover_image && <p className="form-error">{errors.cover_image.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Event Reference</label>
        <Select {...register('event_ref')}>
          <option value="">None</option>
          <option value="Global Developer Summit 2026">Global Developer Summit 2026</option>
          <option value="Webinar: Intro to Next.js 16">Webinar: Intro to Next.js 16</option>
          <option value="Tailwind CSS Workshop">Tailwind CSS Workshop</option>
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
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {isEdit ? 'Save Changes' : 'Create Album'}
        </Button>
      </div>
    </form>
  );
}
