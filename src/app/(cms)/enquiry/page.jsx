'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';
import { useApi } from '@/lib/useApi';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/context/ConfirmContext';
import { Pencil, Trash2 } from 'lucide-react';

export default function EnquiryListPage() {
  const { data, loading, error, reload } = useApi('/enquiries');
  const enquiries = data || [];
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();

  const handleDelete = (id) => {
    confirmDelete('Are you sure you want to delete this enquiry?', async () => {
      try {
        await api.del(`/enquiries/${id}`);
        addToast('Enquiry deleted successfully', 'success');
        reload();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const handleBulkDelete = (ids) => {
    confirmDelete(`Are you sure you want to delete ${ids.length} enquiries?`, async () => {
      try {
        await Promise.allSettled(ids.map((id) => api.del(`/enquiries/${id}`)));
        addToast(`${ids.length} enquiries deleted`, 'success');
        reload();
      } catch (err) {
        addToast(err.message || 'Bulk delete failed', 'danger');
      }
    });
  };

  const columns = [
    { header: 'Ref #', render: (row) => row.reference_no || `#${row.id}` },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Mobile', accessorKey: 'mobile' },
    { header: 'Subject', accessorKey: 'subject' },
    {
      header: 'Submitted Date',
      render: (row) => row.created_at
        ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—'
    },
    {
      header: 'Status',
      render: (row) => {
        const s = row.status || 'New';
        const badgeColor = s === 'New' ? 'badge-primary' : s === 'In Progress' ? 'badge-warning' : s === 'Responded' ? 'badge-info' : 'badge-success';
        return <span className={`badge ${badgeColor}`}>{s}</span>;
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/enquiry/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1">
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
          <h1 className="page-title">Enquiries</h1>
          <p className="page-subtitle">Manage all enquiries</p>
        </div>
      </div>

      {error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load enquiries'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading enquiries…</p>
      ) : (
        <DataTable columns={columns} data={enquiries} searchKey="name" onBulkDelete={handleBulkDelete} />
      )}
    </>
  );
}
