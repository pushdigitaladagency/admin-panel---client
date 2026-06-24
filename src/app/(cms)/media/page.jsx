'use client';

import React, { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/context/ConfirmContext';
import { AlbumForm } from '@/components/media/AlbumForm';
import { ImageForm } from '@/components/media/ImageForm';
import { VideoForm } from '@/components/media/VideoForm';
import { 
  FolderOpen, 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Pencil, 
  Trash2 
} from 'lucide-react';

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState('albums');
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState(null); // 'album', 'image', 'video'
  const [editingItem, setEditingItem] = useState(null);

  // States for list items
  const [albums, setAlbums] = useState([
    { id: 1, title: 'Global Developer Summit 2026 Photos', category: 'Conferences', description: 'Photos from the main developer stage and workshops.', cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120&auto=format&fit=crop&q=60', event_ref: 'Global Developer Summit 2026', status: 'Active', created_at: '2026-06-10T09:00:00Z' },
    { id: 2, title: 'Next.js 16 Launch Event', category: 'Webinars', description: 'Screenshots and promo assets for the virtual launch event.', cover_image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=120&auto=format&fit=crop&q=60', event_ref: 'Webinar: Intro to Next.js 16', status: 'Active', created_at: '2026-06-15T14:30:00Z' },
    { id: 3, title: 'Tailwind CSS Workshop Gallery', category: 'Workshops', description: 'Group photos and presentation slides.', cover_image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=120&auto=format&fit=crop&q=60', event_ref: 'Tailwind CSS Workshop', status: 'Inactive', created_at: '2026-06-08T10:00:00Z' },
  ]);

  const [images, setImages] = useState([
    { id: 1, album_id: 1, title: 'Keynote Speaker on Stage', caption: 'Opening keynote talking about AI standards.', alt_text: 'Speaker gesturing on stage with slides', display_order: 1, status: 'Active', image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=120&auto=format&fit=crop&q=60' },
    { id: 2, album_id: 1, title: 'Q&A Panel Session', caption: 'Panel of 4 experts taking audience questions.', alt_text: 'Four experts seated on high chairs holding microphones', display_order: 2, status: 'Active', image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=120&auto=format&fit=crop&q=60' },
    { id: 3, album_id: 2, title: 'Demo Interface Preview', caption: 'A screenshot showing the new Turbopack compilation times.', alt_text: 'IDE editor and terminal showing build outputs', display_order: 1, status: 'Active', image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=60' },
  ]);

  const [videos, setVideos] = useState([
    { id: 1, title: 'Global Developer Summit 2026 - Highlight Reel', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=120&auto=format&fit=crop&q=60', description: 'A recap of the best moments from this year\'s summit.', status: 'Active' },
    { id: 2, title: 'Next.js 16 Features Breakdown', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&auto=format&fit=crop&q=60', description: 'Detailed visual walk-through of state features and layout shifts.', status: 'Active' },
  ]);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormType(null);
    setEditingItem(null);
  };

  // Submit operations
  const handleAlbumSubmit = async (data) => {
    await new Promise((res) => setTimeout(res, 500));
    const coverUrl = data.cover_image?.[0] 
      ? URL.createObjectURL(data.cover_image[0])
      : editingItem?.cover_image || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=120&auto=format&fit=crop&q=60';

    if (editingItem) {
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === editingItem.id
            ? { ...a, ...data, cover_image: coverUrl }
            : a
        )
      );
      addToast('Gallery album updated successfully (mock)', 'success');
    } else {
      const newAlbum = {
        id: Date.now(),
        ...data,
        cover_image: coverUrl,
        created_at: new Date().toISOString(),
      };
      setAlbums((prev) => [newAlbum, ...prev]);
      addToast('Gallery album created successfully (mock)', 'success');
    }
    handleCloseModal();
  };

  const handleImageSubmit = async (data) => {
    await new Promise((res) => setTimeout(res, 500));
    const imgUrl = data.image_file?.[0]
      ? URL.createObjectURL(data.image_file[0])
      : editingItem?.image_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=120&auto=format&fit=crop&q=60';

    if (editingItem) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === editingItem.id
            ? { ...img, ...data, image_url: imgUrl }
            : img
        )
      );
      addToast('Gallery image updated successfully (mock)', 'success');
    } else {
      const newImage = {
        id: Date.now(),
        ...data,
        image_url: imgUrl,
      };
      setImages((prev) => [newImage, ...prev]);
      addToast('Gallery image uploaded successfully (mock)', 'success');
    }
    handleCloseModal();
  };

  const handleVideoSubmit = async (data) => {
    await new Promise((res) => setTimeout(res, 500));
    const thumbUrl = data.thumbnail_file?.[0]
      ? URL.createObjectURL(data.thumbnail_file[0])
      : editingItem?.thumbnail || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=120&auto=format&fit=crop&q=60';

    if (editingItem) {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === editingItem.id
            ? { ...v, ...data, thumbnail: thumbUrl }
            : v
        )
      );
      addToast('Gallery video updated successfully (mock)', 'success');
    } else {
      const newVideo = {
        id: Date.now(),
        ...data,
        thumbnail: thumbUrl,
      };
      setVideos((prev) => [newVideo, ...prev]);
      addToast('Gallery video added successfully (mock)', 'success');
    }
    handleCloseModal();
  };

  const handleDeleteAlbum = async (id) => {
    confirmDelete('Are you sure you want to delete this album? This will not delete the images inside it.', async () => {
      await new Promise((res) => setTimeout(res, 300));
      setAlbums((prev) => prev.filter((a) => a.id !== id));
      addToast('Album deleted successfully (mock)', 'success');
    });
  };

  const handleDeleteImage = async (id) => {
    confirmDelete('Are you sure you want to delete this image?', async () => {
      await new Promise((res) => setTimeout(res, 300));
      setImages((prev) => prev.filter((img) => img.id !== id));
      addToast('Image deleted successfully (mock)', 'success');
    });
  };

  const handleDeleteVideo = async (id) => {
    confirmDelete('Are you sure you want to delete this video?', async () => {
      await new Promise((res) => setTimeout(res, 300));
      setVideos((prev) => prev.filter((v) => v.id !== id));
      addToast('Video deleted successfully (mock)', 'success');
    });
  };

  const handleBulkDeleteAlbums = async (ids) => {
    confirmDelete(`Are you sure you want to delete ${ids.length} albums?`, () => {
      setAlbums((prev) => prev.filter((a) => !ids.includes(a.id)));
      addToast(`${ids.length} albums deleted (mock)`, 'success');
    });
  };

  const handleBulkDeleteImages = async (ids) => {
    confirmDelete(`Are you sure you want to delete ${ids.length} images?`, () => {
      setImages((prev) => prev.filter((img) => !ids.includes(img.id)));
      addToast(`${ids.length} images deleted (mock)`, 'success');
    });
  };

  const handleBulkDeleteVideos = async (ids) => {
    confirmDelete(`Are you sure you want to delete ${ids.length} videos?`, () => {
      setVideos((prev) => prev.filter((v) => !ids.includes(v.id)));
      addToast(`${ids.length} videos deleted (mock)`, 'success');
    });
  };

  // Columns Configuration
  const albumColumns = [
    {
      header: 'Cover Image',
      render: (row) => (
        <img
          src={row.cover_image || 'https://placehold.co/120x80'}
          alt={row.title}
          className="w-14 h-10 object-cover rounded shadow-sm border border-border"
          style={{ borderColor: 'var(--color-border)' }}
        />
      ),
    },
    { header: 'Album Title', accessorKey: 'title' },
    { header: 'Album Category', accessorKey: 'category' },
    { header: 'Event Reference', render: (row) => row.event_ref || <span className="text-muted text-xs">—</span> },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge ${row.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
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
          src={row.image_url || 'https://placehold.co/80x80'}
          alt={row.title || 'Gallery image'}
          className="w-10 h-10 object-cover rounded border border-border"
          style={{ borderColor: 'var(--color-border)' }}
        />
      ),
    },
    {
      header: 'Album',
      render: (row) => {
        const album = albums.find((a) => a.id === Number(row.album_id));
        return album ? album.title : <span className="text-red-500 font-medium">Unknown Album</span>;
      },
    },
    { header: 'Image Title', render: (row) => row.title || <span className="text-muted text-xs">—</span> },
    { header: 'Caption', render: (row) => row.caption || <span className="text-muted text-xs">—</span> },
    { header: 'Order', accessorKey: 'display_order' },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge ${row.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
          {row.status}
        </span>
      ),
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
          src={row.thumbnail || 'https://placehold.co/120x80'}
          alt={row.title}
          className="w-14 h-10 object-cover rounded shadow-sm border border-border"
          style={{ borderColor: 'var(--color-border)' }}
        />
      ),
    },
    { header: 'Video Title', accessorKey: 'title' },
    {
      header: 'YouTube/Vimeo URL',
      render: (row) => (
        <a href={row.video_url} target="_blank" rel="noopener noreferrer" className="link font-mono text-xs">
          {row.video_url}
        </a>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge ${row.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
          {row.status}
        </span>
      ),
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

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gallery & Media Manager</h1>
          <p className="page-subtitle">Manage gallery albums, images, and videos</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'albums' && (
            <button className="btn btn-primary flex items-center gap-2" onClick={() => handleOpenCreate('album')}>
              <Plus size={18} /> New Album
            </button>
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
      </div>

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
              {albums.map((album) => {
                const albumImageCount = images.filter((img) => img.album_id === album.id).length;
                return (
                  <tr key={album.id}>
                    <td style={{ fontWeight: 500, color: 'var(--color-text)' }}>{album.title}</td>
                    <td>{album.category}</td>
                    <td>{albumImageCount}</td>
                    <td>{new Date(album.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      <span className={`badge ${album.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {album.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
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
          searchKey="title"
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
            initialData={editingItem}
            onSubmit={handleAlbumSubmit}
            onCancel={handleCloseModal}
          />
        )}
        {formType === 'image' && (
          <ImageForm
            albums={albums}
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
