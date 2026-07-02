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

export default function RoleListPage() {
  const { can } = useAuth();
  const canView = can('roles', 'view');
  const canDelete = can('roles', 'delete');
  const { data, loading, error, reload } = useApi('/roles', { enabled: canView });
  const roles = data || [];
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();

  const handleDelete = (id) => {
    if (!canDelete) {
      addToast(`You don't have access to delete the roles module.`, 'danger');
      return;
    }
    confirmDelete('Are you sure you want to delete this role?', async () => {
      try {
        await api.del(`/roles/${id}`);
        addToast('Role deleted successfully', 'success');
        reload();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const columns = [
    { header: 'Role Name', accessorKey: 'name' },
    { header: 'Role Code', accessorKey: 'code' },
    { header: 'Description', accessorKey: 'description' },
    {
      header: 'Users',
      render: (row) => <span className="badge badge-info">{row.userCount ?? 0}</span>
    },
    {
      header: 'Status',
      render: (row) => {
        const raw = row.status;
        const s = typeof raw === 'boolean' ? (raw ? 'active' : 'inactive') : (raw || 'active');
        return (
          <span className={`badge badge-${s === 'active' ? 'success' : s === 'pending' ? 'warning' : s === 'inactive' ? 'danger' : 'secondary'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/roles/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1">
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
          <h1 className="page-title">Roles Management</h1>
          <p className="page-subtitle">Manage user roles and permissions</p>
        </div>
        {canView && error?.status !== 403 && (
          <Link href="/roles/create" className="btn btn-primary">
            + New Role
          </Link>
        )}
      </div>

      {(!canView || error?.status === 403) ? (
        <NoAccess module="roles" action="view" />
      ) : error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load roles'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading roles…</p>
      ) : (
        <DataTable 
          data={roles} 
          columns={columns} 
          searchKey="name" 
          filterOptions={['Active', 'Inactive']}
          filterKey={(row) => {
            const raw = row.status;
            const s = typeof raw === 'boolean' ? (raw ? 'active' : 'inactive') : (raw || 'active');
            return s.charAt(0).toUpperCase() + s.slice(1);
          }}
        />
      )}
    </>
  );
}
