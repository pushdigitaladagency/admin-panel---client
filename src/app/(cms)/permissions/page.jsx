'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';
import { useApi } from '@/lib/useApi';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/context/ConfirmContext';
import { Pencil, Trash2 } from 'lucide-react';

export default function PermissionsListPage() {
  const { data, loading, error, reload } = useApi('/permissions');
  const permissions = data || [];
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();

  const handleDelete = (id) => {
    confirmDelete('Are you sure you want to delete this permission?', async () => {
      try {
        await api.del(`/permissions/${id}`);
        addToast('Permission deleted successfully', 'success');
        reload();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const columns = [
    {
      header: 'Module',
      render: (row) => (
        <span className="badge badge-info">{row.module?.name || '—'}</span>
      ),
    },
    { header: 'Permission Name', accessorKey: 'name' },
    { header: 'Code', accessorKey: 'code' },
    { header: 'Action', accessorKey: 'action' },
    { header: 'Description', accessorKey: 'description' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/permissions/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1">
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
          <h1 className="page-title">Permissions</h1>
          <p className="page-subtitle">View all available system permissions</p>
        </div>
        <Link href="/permissions/create" className="btn btn-primary">
          + New Permission
        </Link>
      </div>

      {error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load permissions'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading permissions…</p>
      ) : (
        <DataTable data={permissions} columns={columns} searchKey="name" />
      )}
    </>
  );
}
