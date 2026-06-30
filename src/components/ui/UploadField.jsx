'use client';

import React from 'react';
import { UploadCloud, FileText, X, Eye } from 'lucide-react';
import { uploadFile, BASE_URL } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

// Lightweight in-app file viewer: renders the file in the SAME tab inside a modal
// overlay (PDF via <iframe>, images via <img>). Non-previewable types (e.g. .docx)
// fall back to open/download links. Closes on overlay click or Escape.
export function FileViewer({ url, fileName, onClose }) {
  const ext = (fileName || url || '').split('.').pop().toLowerCase();
  const isPdf = ext === 'pdf';
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
  const isText = ['txt', 'csv', 'log', 'json', 'xml'].includes(ext);
  const isOffice = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);

  // The server forces a download when ?download=1 (reliable cross-origin).
  const downloadUrl = `${url}${url.includes('?') ? '&' : '?'}download=1`;

  // Office files can't render natively in an iframe; Microsoft's Office Online viewer
  // can — but only for an internet-reachable URL (won't work for localhost).
  const isPublic = /^https?:\/\//.test(url) && !/localhost|127\.0\.0\.1|192\.168\.|10\.|0\.0\.0\.0/.test(url);
  const officeSrc = isOffice && isPublic
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
    : null;

  React.useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Text files render unreliably in a cross-origin iframe, so fetch and show them
  // directly. (/uploads is public + CORS-enabled, so this works without a token.)
  const [textContent, setTextContent] = React.useState(null);
  const [textError, setTextError] = React.useState(null);
  React.useEffect(() => {
    if (!isText) return;
    let active = true;
    setTextContent(null);
    setTextError(null);
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
      .then((t) => active && setTextContent(t))
      .catch((e) => active && setTextError(e.message || 'Failed to load file'));
    return () => { active = false; };
  }, [isText, url]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(1100px, 96vw)', height: '92vh', background: '#fff',
          borderRadius: 10, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <FileText size={18} className="text-muted" />
          <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fileName}</span>
          <a href={url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" title="Open in new tab" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
            <ExternalLink size={14} /> New tab
          </a>
          <a href={downloadUrl} className="btn btn-secondary btn-sm" title="Download" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
            <Download size={14} /> Download
          </a>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} title="Close"><X size={14} /></button>
        </div>

        <div style={{ flex: 1, minHeight: 0, background: '#525659' }}>
          {isText ? (
            textError ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem' }}>
                Failed to load file ({textError}).
              </div>
            ) : textContent === null ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem' }}>Loading…</div>
            ) : (
              <pre style={{ margin: 0, height: '100%', overflow: 'auto', background: '#fff', color: '#1e293b', padding: '16px 20px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: '0.8125rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {textContent}
              </pre>
            )
          ) : isPdf ? (
            <iframe src={url} title={fileName} style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }} />
          ) : isImage ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={url} alt={fileName} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          ) : officeSrc ? (
            <iframe src={officeSrc} title={fileName} style={{ width: '100%', height: '100%', border: 'none' }} />
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#fff', textAlign: 'center', padding: 24 }}>
              <FileText size={40} style={{ opacity: 0.7 }} />
              <p style={{ fontSize: '0.9rem', maxWidth: 420 }}>
                {isOffice
                  ? 'Office documents preview only when served from a public URL (not localhost). Open or download it instead.'
                  : "This file type can't be previewed inline."}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Open in new tab</a>
                <a href={downloadUrl} className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>Download</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Extract the bare filename from any stored path. Uploads live flat in the server's
// /uploads dir, so the filename is all we need. Handles forward/back slashes and
// legacy values where the slashes were lost (e.g. "uploads1782-foo.pdf").
export const uploadFileName = (path) => {
  if (!path) return '';
  let p = String(path).replace(/\\/g, '/');     // backslashes -> slashes
  p = p.split('/').pop();                         // bare filename if slashed
  p = p.replace(/^uploads(?=.)/i, '');            // strip a glued "uploads" prefix (e.g. "uploadsserver-report.txt")
  return p;
};

// Resolve a stored upload path to an absolute URL, always under /uploads/<filename>.
export const resolveUploadUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  const baseHost = BASE_URL.replace(/\/api$/, '');
  return `${baseHost}/uploads/${uploadFileName(path)}`;
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
  const [viewerOpen, setViewerOpen] = React.useState(false);
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

  const fileName = uploadFileName(value);

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
            {uploading ? 'Uploading...' : 'Click to upload'}
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

      {viewerOpen && (
        <FileViewer url={resolveUploadUrl(value)} fileName={fileName} onClose={() => setViewerOpen(false)} />
      )}
    </div>
  );
}
