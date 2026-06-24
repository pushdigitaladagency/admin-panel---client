'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';

export default function RoleListPage() {
  // Mock data
  const roles = [
    { id: 1, name: 'Superadmin', code: '10001', description: 'System administrator with full access.', status: 'active', permissions: Array(25).fill(1) },
    { id: 2, name: 'Editor', code: '10002', description: 'Can edit and publish content.', status: 'active', permissions: Array(10).fill(1) },
    { id: 3, name: 'Author', code: '10003', description: 'Can write and submit content.', status: 'active', permissions: Array(5).fill(1) },
    { id: 4, name: 'Subscriber', code: '10004', description: 'Can read public content.', status: 'inactive', permissions: Array(1).fill(1) },
  ];

  const columns = [
    { header: 'Role Name', accessorKey: 'name' },
    { header: 'Role Code', accessorKey: 'code' },
    { header: 'Description', accessorKey: 'description' },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge badge-${row.status === 'active' ? 'success' : row.status === 'pending' ? 'warning' : row.status === 'inactive' ? 'danger' : 'secondary'}`}>
          {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Active'}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/roles/${row.id}/edit`} className="btn btn-secondary btn-sm">
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
          <h1 className="page-title">Roles Management</h1>
          <p className="page-subtitle">Manage user roles and permissions</p>
        </div>
        <Link href="/roles/create" className="btn btn-primary">
          + New Role
        </Link>
      </div>

      <DataTable data={roles} columns={columns} searchKey="name" />
    </>
  );
}
