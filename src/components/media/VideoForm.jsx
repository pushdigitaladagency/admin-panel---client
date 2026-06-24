'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export function VideoForm({ initialData, onSubmit, onCancel }) {
  const isEdit = !!initialData;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      video_url: initialData?.video_url || '',
      description: initialData?.description || '',
      status: initialData?.status || 'Active',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <div className="form-group">
        <label className="form-label">Video Title</label>
        <Input
          {...register('title')}
          placeholder="e.g. Highlights Reel - Summit 2026"
        />
      </div>

      <div className="form-group">
        <label className="form-label">YouTube/Vimeo URL</label>
        <Input
          {...register('video_url')}
          placeholder="e.g. https://www.youtube.com/watch?v=..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Thumbnail Image</label>
        {isEdit && initialData.thumbnail && (
          <div className="mb-2 flex items-center gap-2">
            <img src={initialData.thumbnail} alt="Current thumbnail" className="w-12 h-12 object-cover rounded" />
            <span className="text-xs text-muted">Current thumbnail</span>
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          {...register('thumbnail_file')}
          style={{ padding: '7px 14px' }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          {...register('description')}
          className="form-textarea"
          placeholder="Optional video description..."
          style={{ minHeight: '80px' }}
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
          {isEdit ? 'Save Changes' : 'Add Video'}
        </Button>
      </div>
    </form>
  );
}
