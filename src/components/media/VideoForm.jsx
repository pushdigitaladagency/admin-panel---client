'use client';

import React from 'react';
import { ImagePlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { BASE_URL } from '@/lib/api';

export function VideoForm({ initialData, onSubmit, onCancel }) {
  const isEdit = !!initialData;

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseHost = BASE_URL.replace(/\/api$/, '');
    return `${baseHost}/${path.replace(/^\/?/, '')}`;
  };

  const [preview, setPreview] = React.useState(initialData?.thumbnail || getImageUrl(initialData?.thumbnail_image) || null);
  const [fileName, setFileName] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      video_url: initialData?.video_url || '',
      description: initialData?.description || '',
      status: (initialData?.status === true || initialData?.status === 1 || initialData?.status === 'Active' || initialData?.status === undefined) ? 'Active' : 'Inactive',
    },
  });

  const thumbnailRegister = register('thumbnail_file');

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
        <input
          type="file"
          id="video-thumbnail-input"
          accept="image/*"
          {...thumbnailRegister}
          style={{ display: 'none' }}
          onChange={(e) => {
            thumbnailRegister.onChange(e);
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
          onClick={() => document.getElementById('video-thumbnail-input').click()}
          className="premium-dropzone"
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
            {fileName || (preview ? 'Change thumbnail' : 'Select thumbnail image')}
          </span>
        </div>
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
        <Button type="submit" variant="primary">
          {isEdit ? 'Save' : 'Add Video'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
