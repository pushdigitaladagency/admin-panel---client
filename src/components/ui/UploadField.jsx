'use client';

import React from 'react';
import { UploadCloud, FileText, X, Eye } from 'lucide-react';
import { uploadFile, BASE_URL } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

// Resolve a stored upload path to an absolute URL for previews.
export const resolveUploadUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  const baseHost = BASE_URL.replace(/\/api$/, '');
  return `${baseHost}/${path.replace(/^\/?/, '')}`;
};

// Controlled file upload field. Uploads immediately on selection and reports the
// saved path string via onChange. Works for images (with preview) and documents.
//
//   <UploadField label="Logo" accept="image/*" value={path} onChange={setPath} />
export function UploadField({
  label,
  accept = 'image/*',
  value = '',
  onChange,
  preview = true,
  hint,
  readonly = false,
}) {
  const { addToast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef(null);
  const isImage = accept.includes('image');

  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadFile(file);
      onChange?.(uploaded?.path || uploaded?.filename || '');
    } catch (err) {
      addToast(err.message || 'Upload failed', 'danger');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const fileName = value ? value.split('/').pop() : '';

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}

      {value ? (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)', background: 'var(--color-surface)',
          }}
        >
          {preview && isImage ? (
            <img src={resolveUploadUrl(value)} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
          ) : (
            <FileText size={22} className="text-muted" style={{ flexShrink: 0 }} />
          )}
          <span style={{ flex: 1, fontSize: '0.8125rem', wordBreak: 'break-all', minWidth: 0 }}>{fileName}</span>

          {/* View button — shown inline for all document files */}
          {!isImage && value && (
            <a
              href={resolveUploadUrl(value)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm"
              title="View file"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0, textDecoration: 'none' }}
            >
              <Eye size={14} />
              View
            </a>
          )}

          {!readonly && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange?.('')} title="Remove" style={{ flexShrink: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>
      ) : readonly ? (
        <div style={{ padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          No file uploaded
        </div>
      ) : (
        <label
          className="premium-dropzone"
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 6, padding: '18px', border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center',
          }}
        >
          <UploadCloud size={26} className="text-muted" />
          <span className="text-muted" style={{ fontSize: '0.8125rem' }}>
            {uploading ? 'Uploading…' : 'Click to upload'}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      )}
      {hint && <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: 4 }}>{hint}</p>}
    </div>
  );
}
