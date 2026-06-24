'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/context/ConfirmContext';

export function MediaLibrary({ initialMedia = [] }) {
  const [media, setMedia] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      // Mock network delay for upload
      await new Promise(res => setTimeout(res, 1000));
      
      const newMedia = Array.from(files).map((file, i) => ({
        id: Date.now() + i,
        name: file.name,
        mime_type: file.type,
        size: file.size,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      }));

      setMedia((prev) => [...newMedia, ...prev]);
      addToast('Files uploaded successfully (mock)', 'success');
    } catch (err) {
      addToast('Upload failed', 'danger');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    confirmDelete('Are you sure you want to delete this file?', async () => {
      try {
        // Mock network delay
        await new Promise(res => setTimeout(res, 500));
        
        setMedia((prev) => prev.filter((m) => m.id !== id));
        addToast('File deleted successfully (mock)', 'success');
      } catch (err) {
        addToast('Failed to delete file', 'danger');
      }
    });
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-body text-center p-12" style={{ border: '2px dashed var(--color-border)', borderRadius: '12px' }}>
          <div className="text-4xl mb-4">☁️</div>
          <h3 className="text-lg font-medium mb-2">Drag and drop files here</h3>
          <p className="text-muted mb-4">or click to browse from your computer</p>
          <label className="btn btn-primary cursor-pointer">
            {uploading ? 'Uploading...' : 'Select Files'}
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <div key={item.id} className="card relative group overflow-hidden">
            <div className="aspect-square bg-surface flex items-center justify-center p-4">
              {item.mime_type.startsWith('image/') ? (
                <img
                  src={item.url || 'https://placehold.co/400x400'}
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="text-4xl text-muted">
                  {item.mime_type.startsWith('video/') ? '🎥' : '📄'}
                </div>
              )}
            </div>
            
            <div className="p-3 text-sm border-t border-border">
              <div className="truncate font-medium" title={item.name}>{item.name}</div>
              <div className="text-muted text-xs mt-1">{formatSize(item.size)}</div>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete file"
            >
              ✕
            </button>
          </div>
        ))}

        {media.length === 0 && (
          <div className="col-span-full text-center text-muted py-12">
            No media files found. Upload some to get started.
          </div>
        )}
      </div>
    </div>
  );
}
