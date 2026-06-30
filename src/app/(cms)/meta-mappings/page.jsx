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

export default function MetaMappingListPage() {
  const { can } = useAuth();
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();
  const canView = can('meta_mappings', 'view');
  const { data, loading, error, reload } = useApi('/meta-mappings', { enabled: canView });
  const rows = data || [];

  const handleDelete = (id) => {
    confirmDelete('Are you sure you want to delete this meta mapping?', async () => {
      try {
        await api.del(`/meta-mappings/${id}`);
        addToast('Meta mapping deleted successfully', 'success');
        reload();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const columns = [
    { header: 'Page Name', render: (row) => row.page_name },
    { header: 'URL', render: (row) => <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{row.url}</span> },
    { header: 'Meta Title', render: (row) => row.meta_title || '—' },
    { header: 'Robots', render: (row) => <span className="badge badge-secondary">{row.robots || 'index, follow'}</span> },
    { header: 'Status', render: (row) => <span className={`badge ${row.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>{row.status || 'Active'}</span> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/meta-mappings/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1"><Pencil size={14} /> Edit</Link>
          <button className="btn btn-danger btn-sm flex items-center gap-1" onClick={() => handleDelete(row.id)}><Trash2 size={14} /> Delete</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Meta Mappings</h1>
          <p className="page-subtitle">Per-URL SEO metadata</p>
        </div>
        {canView && error?.status !== 403 && (
          <Link href="/meta-mappings/create" className="btn btn-primary">+ New Meta Mapping</Link>
        )}
      </div>

      {(!canView || error?.status === 403) ? (
        <NoAccess module="meta_mappings" action="view" />
      ) : error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load meta mappings'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading meta mappings…</p>
      ) : (
        <DataTable data={rows} columns={columns} searchKey="page_name" filterOptions={['Active', 'Inactive']} filterKey={(row) => row.status || 'Active'} />
      )}
    </>
  );
}
