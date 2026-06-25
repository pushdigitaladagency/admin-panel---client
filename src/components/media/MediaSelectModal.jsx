'use client';

import React, { useState } from 'react';
import { 
  Upload, 
  Search, 
  Copy, 
  Download, 
  Maximize, 
  X,
  FileImage,
  CheckCircle2,
  Check
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { api, BASE_URL, uploadFile } from '@/lib/api';

export default function MediaSelectModal({ isOpen, onClose, onSelect, multiple = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Files');
  
  // Track selected IDs
  const [selectedIds, setSelectedIds] = useState([]);
  const fileInputRef = React.useRef(null);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMediaItems = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery-albums');
      const albums = res?.data || [];
      const imagesList = [];
      const baseHost = BASE_URL.replace(/\/api$/, '');
      const resolveUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${baseHost}/${path.replace(/^\/?/, '')}`;
      };

      const parseDate = (createdAt, updatedAt) => {
        const raw = updatedAt || createdAt;
        if (!raw) return 'N/A';
        const d = new Date(raw);
        return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
      };

      albums.forEach(album => {
        const isAlbumActive = album.status === true || album.status === 1 || String(album.status).toLowerCase() === 'active';
        if (album.images && album.images.length) {
          album.images.forEach(img => {
            const isImageActive = img.status === true || img.status === 1 || String(img.status).toLowerCase() === 'active';
            
            // Only show active images whose parent album is also active
            if (isAlbumActive && isImageActive) {
              const fileName = img.image_path.split('/').pop();
              const ext = fileName.split('.').pop().toUpperCase();
              imagesList.push({
                id: img.id,
                name: img.image_title || fileName,
                type: ext || 'IMG',
                size: 'N/A',
                url: resolveUrl(img.image_path),
                path: img.image_path,
                date: parseDate(img.created_at || img.createdAt, img.updated_at || img.updatedAt)
              });
            }
          });
        }
      });
      setMediaItems(imagesList);

      // Asynchronously fetch actual sizes for all items
      imagesList.forEach(item => {
        fetch(item.url, { method: 'HEAD' })
          .then(res => {
            const len = res.headers.get('content-length');
            if (len) {
              const sizeKb = parseInt(len, 10) / 1024;
              let sizeStr = '';
              if (sizeKb > 1024) {
                sizeStr = (sizeKb / 1024).toFixed(2) + ' MB';
              } else {
                sizeStr = sizeKb.toFixed(2) + ' KB';
              }
              setMediaItems(prev => prev.map(m => m.id === item.id ? { ...m, size: sizeStr } : m));
            }
          })
          .catch(err => {
            console.error('Failed to fetch size for', item.url, err);
          });
      });
    } catch (err) {
      console.error('Failed to fetch media library:', err);
      addToast('Failed to load gallery images', 'danger');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  React.useEffect(() => {
    if (isOpen) {
      fetchMediaItems();
    }
  }, [isOpen, fetchMediaItems]);

  const selectedItem = selectedIds.length > 0 ? mediaItems.find(item => item.id === selectedIds[0]) : null;
  const [fileSize, setFileSize] = useState('N/A');

  React.useEffect(() => {
    if (!selectedItem) {
      setFileSize('N/A');
      return;
    }

    if (selectedItem.size && selectedItem.size !== 'N/A') {
      setFileSize(selectedItem.size);
      return;
    }

    let active = true;
    setFileSize('Loading...');

    fetch(selectedItem.url, { method: 'HEAD' })
      .then(res => {
        if (!active) return;
        const len = res.headers.get('content-length');
        if (len) {
          const sizeKb = parseInt(len, 10) / 1024;
          if (sizeKb > 1024) {
            setFileSize((sizeKb / 1024).toFixed(2) + ' MB');
          } else {
            setFileSize(sizeKb.toFixed(2) + ' KB');
          }
        } else {
          setFileSize('N/A');
        }
      })
      .catch(() => {
        if (active) setFileSize('N/A');
      });

    return () => {
      active = false;
    };
  }, [selectedItem]);

  if (!isOpen) return null;

  // Filter media items
  const filteredItems = mediaItems.filter(item => {
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterType !== 'All Files' && item.type !== filterType) return false;
    return true;
  });

  const handleSelectToggle = (id) => {
    if (multiple) {
      setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedIds.length === 0) return;
    
    if (multiple) {
      const items = mediaItems.filter(item => selectedIds.includes(item.id));
      onSelect(items);
    } else {
      const item = mediaItems.find(item => item.id === selectedIds[0]);
      onSelect(item);
    }
    
    // Reset and close
    setSelectedIds([]);
    onClose();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const uploadedItems = [];
      const baseHost = BASE_URL.replace(/\/api$/, '');
      
      for (const file of Array.from(files)) {
        const res = await uploadFile(file);
        const url = `${baseHost}/${res.path.replace(/^\/?/, '')}`;
        uploadedItems.push({
          id: res.filename,
          name: res.filename,
          type: file.name.split('.').pop().toUpperCase(),
          size: (res.size / 1024).toFixed(2) + ' KB',
          url: url,
          path: res.path,
          date: new Date().toLocaleDateString()
        });
      }
      setMediaItems(prev => [...uploadedItems, ...prev]);
      addToast('File(s) uploaded successfully', 'success');
    } catch (err) {
      console.error('Upload failed:', err);
      addToast(err.message || 'Failed to upload file(s)', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="media-modal-overlay">
      <div className="media-modal-container">
        {/* Header */}
        <div className="media-modal-header">
          <h2 className="media-modal-title">Select Media</h2>
          <button className="media-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body Container */}
        <div className="media-modal-body">
          
          {/* Left Sidebar */}
          <div className="media-modal-left-sidebar">
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              multiple 
              accept="image/*"
              onChange={handleFileChange} 
            />
            <button className="media-upload-btn" onClick={handleUploadClick}>
              <Upload size={18} />
              <span>Upload Files</span>
            </button>
            
            <div className="media-filter-group">
              <label>Filter by Type</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="media-select-input"
              >
                <option value="All Files">All Files</option>
                <option value="PNG">PNG</option>
                <option value="JPG">JPG</option>
                <option value="SVG">SVG</option>
              </select>
            </div>
            
            <div className="media-filter-group">
              <label>Search</label>
              <div className="media-search-wrapper">
                <input 
                  type="text" 
                  placeholder="Search files..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="media-search-input"
                />
              </div>
            </div>

            <div className="media-selection-count">
              {selectedIds.length} file(s) selected
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="media-modal-main">
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)', fontSize: '0.875rem' }}>
                Loading gallery images...
              </div>
            ) : filteredItems.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)', fontSize: '0.875rem' }}>
                No images found
              </div>
            ) : (
              <div className="media-grid">
                {filteredItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`media-grid-item ${selectedIds.includes(item.id) ? 'selected' : ''}`}
                    onClick={() => handleSelectToggle(item.id)}
                  >
                    <div className="media-grid-item-image-wrapper">
                      <img src={item.url} alt={item.name} className="media-grid-item-image" />
                      {selectedIds.includes(item.id) && (
                        <div className="media-grid-item-check">
                          <CheckCircle2 size={24} fill="#5A67D8" color="white" />
                        </div>
                      )}
                    </div>
                    <div className="media-grid-item-info">
                      <p className="media-grid-item-name">{item.name}</p>
                      <p className="media-grid-item-meta">{item.type} • {item.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="media-modal-right-sidebar">
            {selectedItem ? (
              <div className="media-details">
                <div className="media-details-preview">
                  <img src={selectedItem.url} alt={selectedItem.name} />
                </div>
                
                <div className="media-details-info-list">
                  <div className="media-details-row">
                    <span className="media-details-label">File Name</span>
                    <span className="media-details-value">{selectedItem.name}</span>
                  </div>
                  <div className="media-details-row">
                    <span className="media-details-label">File Type</span>
                    <span className="media-details-value">{selectedItem.type}</span>
                  </div>
                  <div className="media-details-row">
                    <span className="media-details-label">File Size</span>
                    <span className="media-details-value">{fileSize}</span>
                  </div>
                  <div className="media-details-row">
                    <span className="media-details-label">Uploaded</span>
                    <span className="media-details-value">{selectedItem.date}</span>
                  </div>
                  
                  <div className="media-details-row url-row">
                    <span className="media-details-label">URL</span>
                    <div className="media-url-container">
                      <input type="text" readOnly value={selectedItem.url} />
                      <button 
                        className="media-copy-btn" 
                        onClick={(e) => {
                          navigator.clipboard.writeText(selectedItem.url);
                          setCopied(true);
                          addToast('URL copied to clipboard', 'success');
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        title="Copy to clipboard"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="media-details-actions">
                  <button 
                    className="media-action-btn"
                    onClick={async () => {
                      try {
                        const response = await fetch(selectedItem.url);
                        const blob = await response.blob();
                        const objectUrl = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = objectUrl;
                        link.download = selectedItem.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(objectUrl);
                        addToast('Download started', 'success');
                      } catch (err) {
                        console.error('Download failed', err);
                        // Fallback to opening in new tab
                        window.open(selectedItem.url, '_blank');
                        addToast('Failed to download directly. Opened in new tab.', 'warning');
                      }
                    }}
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                  <button 
                    className="media-action-btn"
                    onClick={() => window.open(selectedItem.url, '_blank')}
                  >
                    <Maximize size={16} />
                    <span>View</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="media-details-empty">
                <FileImage size={48} className="empty-icon" />
                <p>Select a file to view its details</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="media-modal-footer">
          <div className="media-modal-footer-left">
            {mediaItems.length} files available
          </div>
          <div className="media-modal-footer-right">
            <button className="media-cancel-btn" onClick={onClose}>Cancel</button>
            <button 
              className="media-select-confirm-btn" 
              disabled={selectedIds.length === 0}
              onClick={handleConfirmSelection}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
