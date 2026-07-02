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

const STATUS_BADGE = { Active: 'badge-success', Inactive: 'badge-danger', Expired: 'badge-warning' };

export default function CertificateListPage() {
  const { can } = useAuth();
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();
  const canView = can('certificates', 'view');
  const canDelete = can('certificates', 'delete');
  const { data, loading, error, reload } = useApi('/certificates', { enabled: canView });
  const rows = data || [];

  const handleDelete = (id) => {
    if (!canDelete) {
      addToast(`You don't have access to delete the certificates module.`, 'danger');
      return;
    }
    confirmDelete('Are you sure you want to delete this certificate?', async () => {
      try {
        await api.del(`/certificates/${id}`);
        addToast('Certificate deleted successfully', 'success');
        reload();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const columns = [
    { header: 'Title', render: (row) => row.certificate_title },
    { header: 'Number', render: (row) => row.certificate_number || '—' },
    { header: 'Authority', render: (row) => row.issuing_authority || '—' },
    {
      header: 'Issue Date',
      render: (row) => row.issue_date ? new Date(row.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
    },
    { header: 'Featured', render: (row) => <span className={`badge ${row.featured === 'Yes' ? 'badge-info' : 'badge-danger'}`}>{row.featured || 'No'}</span> },
    { header: 'Status', render: (row) => { const s = row.status || 'Active'; return <span className={`badge ${STATUS_BADGE[s] || 'badge-secondary'}`}>{s}</span>; } },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/certificates/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1"><Pencil size={14} /> Edit</Link>
          <button className="btn btn-danger btn-sm flex items-center gap-1" onClick={() => handleDelete(row.id)}><Trash2 size={14} /> Delete</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Certificates</h1>
          <p className="page-subtitle">Manage certifications and accreditations</p>
        </div>
        {canView && error?.status !== 403 && (
          <Link href="/certificates/create" className="btn btn-primary">+ New Certificate</Link>
        )}
      </div>

      {(!canView || error?.status === 403) ? (
        <NoAccess module="certificates" action="view" />
      ) : error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load certificates'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading certificates…</p>
      ) : (
        <DataTable data={rows} columns={columns} searchKey="certificate_title" filterOptions={['Active', 'Inactive', 'Expired']} filterKey={(row) => row.status || 'Active'} />
      )}
    </>
  );
}
