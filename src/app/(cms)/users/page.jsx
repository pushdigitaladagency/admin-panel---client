'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';

export default function UserListPage() {
  // Mock data
  const users = [
    { id: 1, first_name: 'Admin', last_name: 'User', email: 'admin@example.com', mobile_number: '+91 234 567 8900', roles: [1], status: 'Active', last_login: '2026-06-22T10:30:00Z', created_at: '2026-01-15T08:00:00Z' },
    { id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com', mobile_number: '+91 987 654 3210', roles: [2], status: 'Active', last_login: '2026-06-21T14:15:00Z', created_at: '2026-02-20T09:30:00Z' },
    { id: 3, first_name: 'John', last_name: 'Smith', email: 'john@example.com', mobile_number: '+91 555 123 4567', roles: [3], status: 'Inactive', last_login: '2026-05-10T11:45:00Z', created_at: '2026-03-05T10:15:00Z' },
    { id: 4, first_name: 'Test', last_name: 'User', email: 'test@example.com', mobile_number: '+91 444 987 6543', roles: [], status: 'Active', last_login: '2026-06-22T09:00:00Z', created_at: '2026-04-10T16:20:00Z' },
  ];

  const roleMap = {
    1: 'Superadmin',
    2: 'Editor',
    3: 'Author',
  };

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
          {row.roles.map((roleId, i) => (
            <span key={i} className="badge badge-info">
              {roleMap[roleId] || `Role #${roleId}`}
            </span>
          ))}
          {row.roles.length === 0 && <span className="text-muted text-sm">None</span>}
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge ${row.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Last Login',
      render: (row) => new Date(row.last_login).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    {
      header: 'Created Date',
      render: (row) => new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
        <Link href="/users/create" className="btn btn-primary">
          + New User
        </Link>
      </div>

      <DataTable data={users} columns={columns} searchKey="email" />
    </>
  );
}
