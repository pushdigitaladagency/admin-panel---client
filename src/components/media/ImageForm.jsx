'use client';

import React from 'react';
import { ImagePlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export function ImageForm({ albums = [], initialData, onSubmit, onCancel }) {
  const isEdit = !!initialData;

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseHost = (process.env.NEXT_PUBLIC_API_URL || 'http://63.141.242.203:6001/api').replace(/\/api$/, '');
    return `${baseHost}/${path.replace(/^\/?/, '')}`;
  };

  const [preview, setPreview] = React.useState(initialData?.image_url || getImageUrl(initialData?.image_path) || null);
  const [fileName, setFileName] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      album_id: initialData?.album_id ? String(initialData.album_id) : '',
      title: initialData?.image_title || initialData?.title || '',
      caption: initialData?.caption || '',
      alt_text: initialData?.alt_text || '',
      display_order: initialData?.display_order !== undefined ? String(initialData.display_order) : '0',
      status: (initialData?.status === true || initialData?.status === 1 || initialData?.status === 'Active' || initialData?.status === undefined) ? 'Active' : 'Inactive',
    },
  });

  const imageFileRegister = register('image_file', isEdit ? {} : { required: 'Image upload is required' });

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
        <input
          type="file"
          id="image-file-input"
          accept="image/*"
          {...imageFileRegister}
          style={{ display: 'none' }}
          onChange={(e) => {
            imageFileRegister.onChange(e);
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
          onClick={() => document.getElementById('image-file-input').click()}
          className={`premium-dropzone ${errors.image_file ? 'error' : ''}`}
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
            {fileName || (preview ? 'Change image' : 'Select gallery image')}
          </span>
        </div>
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
        <Button type="submit" variant="primary">
          {isEdit ? 'Save' : 'Upload Image'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
