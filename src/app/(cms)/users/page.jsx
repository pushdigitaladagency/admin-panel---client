'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function UserListPage() {
  const { can } = useAuth();
  const canView = can('users', 'view');
  const { data, loading, error } = useApi('/users', { enabled: canView });
  const users = data || [];

  const columns = [
    { header: 'User ID', accessorKey: 'id' },
    {
      header: 'Name',
      render: (row) => `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'No Name'
    },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Mobile Number', accessorKey: 'mobile_number' },
    {
      header: 'Role',
      render: (row) => (
        <div className="flex gap-1 flex-wrap">
          {row.role?.name ? (
            <span className="badge badge-info">{row.role.name}</span>
          ) : (
            <span className="text-muted text-sm">None</span>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge ${row.status ? 'badge-success' : 'badge-danger'}`}>
          {row.status ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Last Login',
      render: (row) => row.last_login_at
        ? new Date(row.last_login_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '—'
    },
    {
      header: 'Created Date',
      render: (row) => row.created_at
        ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—'
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/users/${row.id}/edit`} className="btn btn-secondary btn-sm">
            Edit
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Manage system users and access</p>
        </div>
        {canView && error?.status !== 403 && (
          <Link href="/users/create" className="btn btn-primary">
            + New User
          </Link>
        )}
      </div>

      {(!canView || error?.status === 403) ? (
        <NoAccess module="users" action="view" />
      ) : error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load users'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading users…</p>
      ) : (
        <DataTable 
          data={users} 
          columns={columns} 
          searchKey="email" 
          filterOptions={['Active', 'Inactive']}
          filterKey={(row) => row.status ? 'Active' : 'Inactive'}
        />
      )}
    </>
  );
}
