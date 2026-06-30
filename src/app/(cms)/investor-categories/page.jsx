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

export default function InvestorCategoryListPage() {
  const { can } = useAuth();
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();
  const canView = can('investors', 'view');
  const { data, loading, error, reload } = useApi('/investor-categories', { enabled: canView });
  const rows = data || [];

  const handleDelete = (id) => {
    confirmDelete('Are you sure you want to delete this category?', async () => {
      try {
        await api.del(`/investor-categories/${id}`);
        addToast('Category deleted successfully', 'success');
        reload();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const columns = [
    { header: 'Category Name', render: (row) => row.category_name },
    { header: 'Order', render: (row) => row.display_order ?? 0 },
    { header: 'Status', render: (row) => <span className={`badge ${row.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>{row.status || 'Active'}</span> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/investor-categories/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1"><Pencil size={14} /> Edit</Link>
          <button className="btn btn-danger btn-sm flex items-center gap-1" onClick={() => handleDelete(row.id)}><Trash2 size={14} /> Delete</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Investor Categories</h1>
          <p className="page-subtitle">Groups for investor documents</p>
        </div>
        {canView && error?.status !== 403 && (
          <Link href="/investor-categories/create" className="btn btn-primary">+ New Category</Link>
        )}
      </div>

      {(!canView || error?.status === 403) ? (
        <NoAccess module="investors" action="view" />
      ) : error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load categories'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading categories…</p>
      ) : (
        <DataTable data={rows} columns={columns} searchKey="category_name" filterOptions={['Active', 'Inactive']} filterKey={(row) => row.status || 'Active'} />
      )}
    </>
  );
}
