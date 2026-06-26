'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/context/ConfirmContext';
import { AlbumForm } from '@/components/media/AlbumForm';
import { ImageForm } from '@/components/media/ImageForm';
import { VideoForm } from '@/components/media/VideoForm';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';
import { api, BASE_URL, uploadFile } from '@/lib/api';
import { 
  FolderOpen, 
  Image as ImageIcon, 
  Video, 
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  ImagePlus
} from 'lucide-react';

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState('albums');
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();
  const { can } = useAuth();

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [preselectedAlbumId, setPreselectedAlbumId] = useState(null);

  const canViewGallery = can('gallery', 'view');

  // Fetch from API (skip the calls entirely when the user can't view the gallery)
  const { data: albumsData, loading: albumsLoading, error: albumsError, reload: reloadAlbums } = useApi('/gallery-albums', { enabled: canViewGallery });
  const { data: videosData, loading: videosLoading, reload: reloadVideos } = useApi('/gallery-videos', { enabled: canViewGallery });
  const { data: categoriesData } = useApi('/gallery-categories', { enabled: canViewGallery });
  const { data: eventsData } = useApi('/events', { enabled: canViewGallery });

  const albums = albumsData || [];
  const videos = videosData || [];

  // Flatten images from albums for the images tab
  const images = albums.reduce((acc, album) => {
    const isAlbumActive = album.status === true || album.status === 1 || String(album.status).toLowerCase() === 'active';
    if (album.images && album.images.length) {
      const mappedImages = album.images.map((img) => {
        const isImageActive = img.status === true || img.status === 1 || String(img.status).toLowerCase() === 'active';
        return {
          ...img,
          album_title: album.title,
          status: (isAlbumActive && isImageActive) ? 'Active' : 'Inactive'
        };
      });
      return [...acc, ...mappedImages];
    }
    return acc;
  }, []);

  // Handlers
  const handleOpenCreate = (type) => {
    setFormType(type);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (type, item) => {
    setFormType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Open the image upload modal pre-targeted to a specific album.
  const handleUploadToAlbum = (album) => {
    setFormType('image');
    setEditingItem(null);
    setPreselectedAlbumId(album.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormType(null);
    setEditingItem(null);
    setPreselectedAlbumId(null);
  };

  // --- Submit operations (real API calls) ---

  const handleAlbumSubmit = async (data) => {
    try {
      let coverImagePath = editingItem?.cover_image || '';
      if (data.cover_image?.[0] instanceof File) {
        const uploaded = await uploadFile(data.cover_image[0]);
        coverImagePath = uploaded?.path || uploaded?.filename || '';
      }

      const payload = {
        title: data.title,
        category_id: data.category_id ? Number(data.category_id) : null,
        description: data.description,
        cover_image: coverImagePath,
        event_id: data.event_id ? Number(data.event_id) : null,
        status: data.status === 'Active' || data.status === true,
      };

      if (editingItem) {
        await api.put(`/gallery-albums/${editingItem.id}`, payload);
        addToast('Gallery album updated successfully', 'success');
      } else {
        await api.post('/gallery-albums', payload);
        addToast('Gallery album created successfully', 'success');
      }
      reloadAlbums();
      handleCloseModal();
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  const handleImageSubmit = async (data) => {
    try {
      let imagePath = editingItem?.image_path || '';
      if (data.image_file?.[0] instanceof File) {
        const uploaded = await uploadFile(data.image_file[0]);
        imagePath = uploaded?.path || uploaded?.filename || '';
      }

      if (editingItem) {
        await api.put(`/gallery-images/${editingItem.id}`, {
          image_path: imagePath,
          image_title: data.title,
          caption: data.caption,
          alt_text: data.alt_text,
          display_order: data.display_order ? Number(data.display_order) : 0,
          status: data.status === 'Active' || data.status === true,
        });
        addToast('Gallery image updated successfully', 'success');
      } else {
        const albumId = data.album_id || (albums[0]?.id);
        if (!albumId) {
          addToast('Please create an album first', 'danger');
          return;
        }
        await api.post(`/gallery-albums/${albumId}/images`, {
          image_path: imagePath,
          image_title: data.title,
          caption: data.caption,
          alt_text: data.alt_text,
          display_order: data.display_order ? Number(data.display_order) : 0,
        });
        addToast('Gallery image uploaded successfully', 'success');
      }
      reloadAlbums();
      handleCloseModal();
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  const handleVideoSubmit = async (data) => {
    try {
      let thumbnailPath = editingItem?.thumbnail_image || '';
      if (data.thumbnail_file?.[0] instanceof File) {
        const uploaded = await uploadFile(data.thumbnail_file[0]);
        thumbnailPath = uploaded?.path || uploaded?.filename || '';
      }

      const payload = {
        title: data.title,
        video_url: data.video_url,
        thumbnail_image: thumbnailPath,
        description: data.description,
        status: data.status === 'Active' || data.status === true,
      };

      if (editingItem) {
        await api.put(`/gallery-videos/${editingItem.id}`, payload);
        addToast('Gallery video updated successfully', 'success');
      } else {
        await api.post('/gallery-videos', payload);
        addToast('Gallery video added successfully', 'success');
      }
      reloadVideos();
      handleCloseModal();
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  const handleDeleteAlbum = (id) => {
    confirmDelete('Are you sure you want to delete this album? This will not delete the images inside it.', async () => {
      try {
        await api.del(`/gallery-albums/${id}`);
        addToast('Album deleted successfully', 'success');
        reloadAlbums();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const handleDeleteImage = (id) => {
    confirmDelete('Are you sure you want to delete this image?', async () => {
      try {
        await api.del(`/gallery-images/${id}`);
        addToast('Image deleted successfully', 'success');
        reloadAlbums();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const handleDeleteVideo = (id) => {
    confirmDelete('Are you sure you want to delete this video?', async () => {
      try {
        await api.del(`/gallery-videos/${id}`);
        addToast('Video deleted successfully', 'success');
        reloadVideos();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const handleBulkDeleteAlbums = (ids) => {
    confirmDelete(`Are you sure you want to delete ${ids.length} albums?`, async () => {
      await Promise.allSettled(ids.map((id) => api.del(`/gallery-albums/${id}`)));
      addToast(`${ids.length} albums deleted`, 'success');
      reloadAlbums();
    });
  };

  const handleBulkDeleteImages = (ids) => {
    confirmDelete(`Are you sure you want to delete ${ids.length} images?`, async () => {
      await Promise.allSettled(ids.map((id) => api.del(`/gallery-images/${id}`)));
      addToast(`${ids.length} images deleted`, 'success');
      reloadAlbums();
    });
  };

  const handleBulkDeleteVideos = (ids) => {
    confirmDelete(`Are you sure you want to delete ${ids.length} videos?`, async () => {
      await Promise.allSettled(ids.map((id) => api.del(`/gallery-videos/${id}`)));
      addToast(`${ids.length} videos deleted`, 'success');
      reloadVideos();
    });
  };

  // Helper to resolve image paths to full URL
  const resolveImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Build URL from the API base (strip /api suffix)
    const baseHost = BASE_URL.replace(/\/api$/, '');
    return `${baseHost}/${path.replace(/^\/?/, '')}`;
  };

  // Columns Configuration
  const albumColumns = [
    {
      header: 'Cover Image',
      render: (row) => (
        <img
          src={resolveImageUrl(row.cover_image) || 'https://placehold.co/120x80'}
          alt={row.title}
          style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
        />
      ),
    },
    { header: 'Album Title', accessorKey: 'title' },
    { header: 'Category', render: (row) => row.category?.name || '—' },
    { header: 'Event', render: (row) => row.event?.title || <span className="text-muted text-xs">—</span> },
    { header: 'Images', render: (row) => row.images?.length ?? 0 },
    {
      header: 'Status',
      render: (row) => {
        const active = row.status === true || row.status === 1 || row.status === 'Active';
        return <span className={`badge ${active ? 'badge-success' : 'badge-danger'}`}>{active ? 'Active' : 'Inactive'}</span>;
      },
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={() => handleUploadToAlbum(row)}>
            <ImagePlus size={14} /> Upload Image
          </button>
          <button className="btn btn-secondary btn-sm flex items-center gap-1" onClick={() => handleOpenEdit('album', row)}>
            <Pencil size={14} /> Edit
          </button>
          <button className="btn btn-danger btn-sm flex items-center gap-1" onClick={() => handleDeleteAlbum(row.id)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  const imageColumns = [
    {
      header: 'Image',
      render: (row) => (
        <img
          src={resolveImageUrl(row.image_path) || 'https://placehold.co/80x80'}
          alt={row.image_title || 'Gallery image'}
          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
        />
      ),
    },
    {
      header: 'Album',
      render: (row) => row.album_title || '—',
    },
    { header: 'Image Title', render: (row) => row.image_title || <span className="text-muted text-xs">—</span> },
    { header: 'Caption', render: (row) => row.caption || <span className="text-muted text-xs">—</span> },
    { header: 'Order', accessorKey: 'display_order' },
    {
      header: 'Status',
      render: (row) => {
        const active = row.status === true || row.status === 1 || row.status === 'Active';
        return <span className={`badge ${active ? 'badge-success' : 'badge-secondary'}`}>{active ? 'Active' : 'Inactive'}</span>;
      },
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm flex items-center gap-1" onClick={() => handleOpenEdit('image', row)}>
            <Pencil size={14} /> Edit
          </button>
          <button className="btn btn-danger btn-sm flex items-center gap-1" onClick={() => handleDeleteImage(row.id)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  const videoColumns = [
    {
      header: 'Thumbnail',
      render: (row) => (
        <img
          src={resolveImageUrl(row.thumbnail_image) || 'https://placehold.co/120x80'}
          alt={row.title}
          style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
        />
      ),
    },
    { header: 'Video Title', accessorKey: 'title' },
    {
      header: 'YouTube/Vimeo URL',
      render: (row) => {
        const url = row.video_url || '';
        const href = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')
          ? url
          : `https://${url}`;
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className="link font-mono text-xs">
            {url}
          </a>
        );
      },
    },
    {
      header: 'Status',
      render: (row) => {
        const active = row.status === true || row.status === 1 || row.status === 'Active';
        return <span className={`badge ${active ? 'badge-success' : 'badge-secondary'}`}>{active ? 'Active' : 'Inactive'}</span>;
      },
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm flex items-center gap-1" onClick={() => handleOpenEdit('video', row)}>
            <Pencil size={14} /> Edit
          </button>
          <button className="btn btn-danger btn-sm flex items-center gap-1" onClick={() => handleDeleteVideo(row.id)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  const isLoading = albumsLoading || videosLoading;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gallery & Media Manager</h1>
          <p className="page-subtitle">Manage gallery albums, images, and videos</p>
        </div>
        {canViewGallery && albumsError?.status !== 403 && (
        <div className="flex gap-2">
          {activeTab === 'albums' && (
            <div className="flex gap-2">
              <Link href="/terms/gallery-category" className="btn btn-secondary flex items-center gap-2">
                <FolderTree size={18} /> Manage Categories
              </Link>
              <button className="btn btn-primary flex items-center gap-2" onClick={() => handleOpenCreate('album')}>
                <Plus size={18} /> New Album
              </button>
            </div>
          )}
          {activeTab === 'images' && (
            <button className="btn btn-primary flex items-center gap-2" onClick={() => handleOpenCreate('image')}>
              <Plus size={18} /> Upload Image
            </button>
          )}
          {activeTab === 'videos' && (
            <button className="btn btn-primary flex items-center gap-2" onClick={() => handleOpenCreate('video')}>
              <Plus size={18} /> Add Video
            </button>
          )}
        </div>
        )}
      </div>

      {(!canViewGallery || albumsError?.status === 403) ? (
        <NoAccess module="gallery" action="view" />
      ) : (
      <>
      {/* Album Details Overview */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Album Details</h3>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Album Name</th>
                <th>Category</th>
                <th>Total Images</th>
                <th>Created Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="data-table-empty">Loading…</td></tr>
              ) : albums.length === 0 ? (
                <tr><td colSpan={5} className="data-table-empty">No albums yet</td></tr>
              ) : (
                albums.map((album) => (
                  <tr key={album.id}>
                    <td style={{ fontWeight: 500, color: 'var(--color-text)' }}>{album.title}</td>
                    <td>{album.category?.name || '—'}</td>
                    <td>{album.images?.length ?? 0}</td>
                    <td>{album.created_at ? new Date(album.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                    <td>
                      <span className={`badge ${album.status ? 'badge-success' : 'badge-danger'}`}>
                        {album.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'albums' ? 'active' : ''}`}
          onClick={() => setActiveTab('albums')}
        >
          <FolderOpen size={18} /> Albums
        </button>
        <button
          className={`tab-btn ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          <ImageIcon size={18} /> Images
        </button>
        <button
          className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          <Video size={18} /> Videos
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'albums' && (
        <DataTable
          data={albums}
          columns={albumColumns}
          searchKey="title"
          onBulkDelete={handleBulkDeleteAlbums}
        />
      )}

      {activeTab === 'images' && (
        <DataTable
          data={images}
          columns={imageColumns}
          searchKey="image_title"
          onBulkDelete={handleBulkDeleteImages}
        />
      )}

      {activeTab === 'videos' && (
        <DataTable
          data={videos}
          columns={videoColumns}
          searchKey="title"
          onBulkDelete={handleBulkDeleteVideos}
        />
      )}
      </>
      )}

      {/* Interactive Forms Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          formType === 'album'
            ? editingItem
              ? 'Edit Gallery Album'
              : 'Create Gallery Album'
            : formType === 'image'
            ? editingItem
              ? 'Edit Gallery Image'
              : 'Upload Gallery Image'
            : formType === 'video'
            ? editingItem
              ? 'Edit Gallery Video'
              : 'Add Gallery Video'
            : ''
        }
      >
        {formType === 'album' && (
          <AlbumForm
            categories={categoriesData || []}
            events={eventsData || []}
            initialData={editingItem}
            onSubmit={handleAlbumSubmit}
            onCancel={handleCloseModal}
          />
        )}
        {formType === 'image' && (
          <ImageForm
            key={editingItem?.id || `album-${preselectedAlbumId || 'new'}`}
            albums={albums}
            defaultAlbumId={preselectedAlbumId}
            initialData={editingItem}
            onSubmit={handleImageSubmit}
            onCancel={handleCloseModal}
          />
        )}
        {formType === 'video' && (
          <VideoForm
            initialData={editingItem}
            onSubmit={handleVideoSubmit}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </>
  );
}
