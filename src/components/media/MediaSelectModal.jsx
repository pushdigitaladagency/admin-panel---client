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

export default function MediaSelectModal({ isOpen, onClose, onSelect, multiple = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Files');
  
  // Track selected IDs
  const [selectedIds, setSelectedIds] = useState([]);
  const fileInputRef = React.useRef(null);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  // Mock media library data
  const [mediaItems, setMediaItems] = useState([
    { id: 1, name: 'Screenshot 2026-06-23 111811 (1)', type: 'PNG', size: '59.55 KB', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60', date: '6/24/2026' },
    { id: 2, name: 'hero-banner-v2', type: 'JPG', size: '124.20 KB', url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=500&auto=format&fit=crop&q=60', date: '6/23/2026' },
    { id: 3, name: 'avatar-placeholder', type: 'SVG', size: '12.05 KB', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60', date: '6/20/2026' },
    { id: 4, name: 'conference-room', type: 'JPG', size: '890.11 KB', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=60', date: '6/19/2026' },
    { id: 5, name: 'product-mockup', type: 'PNG', size: '450.33 KB', url: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&auto=format&fit=crop&q=60', date: '6/18/2026' },
    { id: 6, name: 'team-photo-2026', type: 'JPG', size: '1.2 MB', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60', date: '6/15/2026' },
    { id: 7, name: 'logo-transparent', type: 'PNG', size: '45.10 KB', url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=500&auto=format&fit=crop&q=60', date: '6/10/2026' },
    { id: 8, name: 'app-icon', type: 'PNG', size: '25.00 KB', url: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055ce?w=500&auto=format&fit=crop&q=60', date: '6/05/2026' },
  ]);

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

  const selectedItem = selectedIds.length > 0 ? mediaItems.find(item => item.id === selectedIds[0]) : null;

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

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newMedia = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        type: file.name.split('.').pop().toUpperCase(),
        size: (file.size / 1024).toFixed(2) + ' KB',
        url: URL.createObjectURL(file),
        date: new Date().toLocaleDateString()
      }));
      setMediaItems(prev => [...newMedia, ...prev]);
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
                    <span className="media-details-value">{selectedItem.size}</span>
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
