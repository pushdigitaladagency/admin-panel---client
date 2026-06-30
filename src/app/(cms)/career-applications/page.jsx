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
  New: 'badge-primary',
  'Under Review': 'badge-warning',
  Shortlisted: 'badge-info',
  'Interview Scheduled': 'badge-purple',
  Selected: 'badge-success',
  Rejected: 'badge-danger',
  'On Hold': 'badge-secondary',
};

export default function CareerApplicationListPage() {
  const { can } = useAuth();
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();
  const canView = can('career_applications', 'view');
  const { data, loading, error, reload } = useApi('/career-applications', { enabled: canView });
  const applications = data || [];

  const handleDelete = (id) => {
    confirmDelete('Are you sure you want to delete this application?', async () => {
      try {
        await api.del(`/career-applications/${id}`);
        addToast('Application deleted successfully', 'success');
        reload();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const columns = [
    { header: 'Candidate', render: (row) => row.full_name },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Position', render: (row) => row.applied_position || '—' },
    { header: 'Experience', render: (row) => (row.total_experience != null ? `${row.total_experience} yrs` : '—') },
    {
      header: 'Applied Date',
      render: (row) => row.applied_date
        ? new Date(row.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—',
    },
    {
      header: 'Status',
      render: (row) => {
        const s = row.application_status || 'New';
        return <span className={`badge ${STATUS_BADGE[s] || 'badge-secondary'}`}>{s}</span>;
      },
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/career-applications/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1">
            <Pencil size={14} /> View / Edit
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
          <h1 className="page-title">Career Applications</h1>
          <p className="page-subtitle">Manage candidate applications</p>
        </div>
        {canView && error?.status !== 403 && can('career_applications', 'create') && (
          <Link href="/career-applications/create" className="btn btn-primary">+ New Application</Link>
        )}
      </div>

      {(!canView || error?.status === 403) ? (
        <NoAccess module="career_applications" action="view" />
      ) : error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load applications'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading applications…</p>
      ) : (
        <DataTable
          data={applications}
          columns={columns}
          searchKey="full_name"
          filterOptions={['New', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'On Hold']}
          filterKey={(row) => row.application_status || 'New'}
        />
      )}
    </>
  );
}
