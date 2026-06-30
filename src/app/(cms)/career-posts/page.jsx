'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/context/ConfirmContext';
import { Pencil, Trash2 } from 'lucide-react';

const STATUS_BADGE = {
  Published: 'badge-success',
  Open: 'badge-primary',
  Draft: 'badge-warning',
  Closed: 'badge-danger',
  'On Hold': 'badge-info',
  Archived: 'badge-purple',
};

export default function CareerPostListPage() {
  const { can } = useAuth();
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();
  const canView = can('career_posts', 'view');
  const { data, loading, error, reload } = useApi('/career-posts', { enabled: canView });
  const posts = data || [];

  const handleDelete = (id) => {
    confirmDelete('Are you sure you want to delete this career post?', async () => {
      try {
        await api.del(`/career-posts/${id}`);
        addToast('Career post deleted successfully', 'success');
        reload();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const columns = [
    { header: 'Job Title', render: (row) => row.job_title },
    { header: 'Department', render: (row) => row.department || '—' },
    { header: 'Type', render: (row) => row.employment_type ? <span className="badge badge-info">{row.employment_type}</span> : '—' },
    { header: 'Vacancies', render: (row) => row.no_of_vacancies ?? '—' },
    {
      header: 'Publish Date',
      render: (row) => row.publish_date
        ? new Date(row.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—',
    },
    {
      header: 'Status',
      render: (row) => {
        // Backend sometimes returns all caps (e.g., "ARCHIVED", "CLOSED", "ON HOLD")
        const rawStatus = row.status || 'Draft';
        const s = String(rawStatus)
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return <span className={`badge ${STATUS_BADGE[s] || 'badge-secondary'}`}>{s}</span>;
      },
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/career-posts/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1">
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
          <h1 className="page-title">Career Posts</h1>
          <p className="page-subtitle">Manage job openings</p>
        </div>
        {canView && error?.status !== 403 && (
          <Link href="/career-posts/create" className="btn btn-primary">+ New Career Post</Link>
        )}
      </div>

      {(!canView || error?.status === 403) ? (
        <NoAccess module="career_posts" action="view" />
      ) : error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load career posts'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading career posts…</p>
      ) : (
        <DataTable
          data={posts}
          columns={columns}
          searchKey="job_title"
          filterOptions={['Draft', 'Published', 'Open', 'Closed', 'On Hold', 'Archived']}
          filterKey={(row) => row.status || 'Draft'}
        />
      )}
    </>
  );
}
