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

const STATUS_BADGE = { Published: 'badge-success', Draft: 'badge-warning', Archived: 'badge-secondary' };

export default function InvestorDocumentListPage() {
  const { can } = useAuth();
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();
  const canView = can('investors', 'view');
  const { data, loading, error, reload } = useApi('/investor-documents', { enabled: canView });
  const rows = data || [];

  const handleDelete = (id) => {
    confirmDelete('Are you sure you want to delete this document?', async () => {
      try {
        await api.del(`/investor-documents/${id}`);
        addToast('Document deleted successfully', 'success');
        reload();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const columns = [
    { header: 'Title', render: (row) => row.title },
    { header: 'Category', render: (row) => row.category?.category_name || '—' },
    { header: 'Financial Year', render: (row) => row.financial_year || '—' },
    {
      header: 'Publish Date',
      render: (row) => row.publish_date ? new Date(row.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
    },
    { header: 'Downloads', render: (row) => row.download_count ?? 0 },
    { header: 'Status', render: (row) => { const s = row.status || 'Draft'; return <span className={`badge ${STATUS_BADGE[s] || 'badge-secondary'}`}>{s}</span>; } },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/investor-documents/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1"><Pencil size={14} /> Edit</Link>
          <button className="btn btn-danger btn-sm flex items-center gap-1" onClick={() => handleDelete(row.id)}><Trash2 size={14} /> Delete</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Investor Documents</h1>
          <p className="page-subtitle">Manage investor relations documents</p>
        </div>
        {canView && error?.status !== 403 && (
          <Link href="/investor-documents/create" className="btn btn-primary">+ New Document</Link>
        )}
      </div>

      {(!canView || error?.status === 403) ? (
        <NoAccess module="investors" action="view" />
      ) : error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load documents'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading documents…</p>
      ) : (
        <DataTable data={rows} columns={columns} searchKey="title" filterOptions={['Draft', 'Published', 'Archived']} filterKey={(row) => row.status || 'Draft'} />
      )}
    </>
  );
}
