'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/context/ConfirmContext';
import { Pencil, Trash2 } from 'lucide-react';

// Map frontend postType slug to API path
const POST_API = {
  news: '/news',
  event: '/events',
  'press-release': '/press-releases',
};

// Map frontend postType slug to RBAC module code
const POST_MODULE = {
  news: 'news',
  event: 'events',
  'press-release': 'press_releases',
};

export default function PostListPage() {
  const params = useParams();
  const postType = params.postType || 'post';
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();
  const { can } = useAuth();

  const apiPath = POST_API[postType] || '/press-releases';
  const moduleCode = POST_MODULE[postType] || 'press_releases';
  const canView = can(moduleCode, 'view');
  const { data, loading, error, reload } = useApi(apiPath, { enabled: canView });
  const posts = data || [];

  const postTypeLabel = postType === 'news'
    ? 'News'
    : postType === 'event'
      ? 'Events'
      : 'Press Releases';
  const singularPostTypeLabel = postType === 'news'
    ? 'News'
    : postType === 'event'
      ? 'Event'
      : 'Press Release';

  const handleDelete = (id) => {
    confirmDelete(`Are you sure you want to delete this ${singularPostTypeLabel.toLowerCase()}?`, async () => {
      try {
        await api.del(`${apiPath}/${id}`);
        addToast(`${singularPostTypeLabel} deleted successfully`, 'success');
        reload();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const columns = postType === 'event' ? [
    { header: 'Event Name', render: (row) => row.title },
    {
      header: 'Start Date',
      render: (row) => row.event_start_date
        ? new Date(row.event_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—'
    },
    {
      header: 'End Date',
      render: (row) => row.event_end_date
        ? new Date(row.event_end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—'
    },
    { header: 'Venue', render: (row) => row.venue || '—' },
    { header: 'Type', render: (row) => row.eventType?.name ? <span className="badge badge-info">{row.eventType.name}</span> : '—' },
    {
      header: 'Status',
      render: (row) => {
        const status = row.event_status || row.publish_status || 'Draft';
        const badgeColor =
          status === 'Ongoing' ? 'badge-purple' :
          status === 'Upcoming' ? 'badge-primary' :
          status === 'Completed' ? 'badge-success' :
          status === 'Published' ? 'badge-success' : 'badge-secondary';
        return <span className={`badge ${badgeColor}`}>{status}</span>;
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/posts/${postType}/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1">
            <Pencil size={14} /> Edit
          </Link>
          <button className="btn btn-danger btn-sm flex items-center gap-1" onClick={() => handleDelete(row.id)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ] : postType === 'news' ? [
    { header: 'Headline', render: (row) => row.title },
    { header: 'Category', render: (row) => row.category?.name || '—' },
    { header: 'Author', render: (row) => row.author || row.authorUser ? `${row.authorUser?.first_name || ''} ${row.authorUser?.last_name || ''}`.trim() || row.author : 'Admin' },
    {
      header: 'Publish Date',
      render: (row) => row.publish_date
        ? new Date(row.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—'
    },
    {
      header: 'Status',
      render: (row) => {
        const status = row.status || 'Draft';
        const badgeColor = status === 'Published' ? 'badge-success' : status === 'Archived' ? 'badge-secondary' : 'badge-warning';
        return <span className={`badge ${badgeColor}`}>{status}</span>;
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/posts/${postType}/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1">
            <Pencil size={14} /> Edit
          </Link>
          <button className="btn btn-danger btn-sm flex items-center gap-1" onClick={() => handleDelete(row.id)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ] : [
    { header: 'Title', render: (row) => row.title },
    { header: 'Category', render: (row) => row.category?.name || '—' },
    {
      header: 'Publish Date',
      render: (row) => row.publish_date
        ? new Date(row.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—'
    },
    {
      header: 'Status',
      render: (row) => {
        const status = row.status || 'Draft';
        const badgeColor = status === 'Published' ? 'badge-success' : 'badge-warning';
        return <span className={`badge ${badgeColor}`}>{status}</span>;
      }
    },
    {
      header: 'Featured',
      render: (row) => (
        <span className={`badge ${row.featured ? 'badge-info' : 'badge-danger'}`}>{row.featured ? 'Yes' : 'No'}</span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/posts/${postType}/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1">
            <Pencil size={14} /> Edit
          </Link>
          <button className="btn btn-danger btn-sm flex items-center gap-1" onClick={() => handleDelete(row.id)}>
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
          <h1 className="page-title">{postTypeLabel}</h1>
          <p className="page-subtitle">Manage your {singularPostTypeLabel.toLowerCase()} content</p>
        </div>
        {canView && error?.status !== 403 && (
          <Link href={`/posts/${postType}/create`} className="btn btn-primary">
            + New {singularPostTypeLabel}
          </Link>
        )}
      </div>

      {(!canView || error?.status === 403) ? (
        <NoAccess module={moduleCode} action="view" />
      ) : error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || `Failed to load ${postTypeLabel.toLowerCase()}`}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading {postTypeLabel.toLowerCase()}…</p>
      ) : (
        <DataTable 
          data={posts} 
          columns={columns} 
          searchKey="title" 
          filterOptions={
            postType === 'event' 
              ? ['Ongoing', 'Upcoming', 'Completed']
              : ['Draft', 'Published']
          }
          filterKey={
            postType === 'event'
              ? (row) => row.event_status || row.publish_status || 'Draft'
              : (row) => row.status || 'Draft'
          }
        />
      )}
    </>
  );
}
