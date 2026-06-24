'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';

export default function PermissionsListPage() {
  // Mock data
  const permissions = [
    { id: 1, name: 'post.view', description: 'Can view posts', group: 'Post' },
    { id: 2, name: 'post.create', description: 'Can create new posts', group: 'Post' },
    { id: 3, name: 'post.edit', description: 'Can edit posts', group: 'Post' },
    { id: 4, name: 'post.delete', description: 'Can delete posts', group: 'Post' },
    { id: 5, name: 'user.view', description: 'Can view users', group: 'User' },
    { id: 6, name: 'user.create', description: 'Can create users', group: 'User' },
    { id: 7, name: 'user.edit', description: 'Can edit users', group: 'User' },
    { id: 8, name: 'user.delete', description: 'Can delete users', group: 'User' },
    { id: 9, name: 'role.view', description: 'Can view roles', group: 'Role' },
    { id: 10, name: 'settings.edit', description: 'Can modify global settings', group: 'Settings' },
  ];

  const columns = [
    {
      header: 'Module Name',
      render: (row) => (
        <span className="badge badge-info">{row.group}</span>
      ),
    },
    { header: 'Permission Name', accessorKey: 'name' },
    { header: 'Description', accessorKey: 'description' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/permissions/${row.id}/edit`} className="btn btn-secondary btn-sm">
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
          <h1 className="page-title">Permissions</h1>
          <p className="page-subtitle">View all available system permissions</p>
        </div>
        <Link href="/permissions/create" className="btn btn-primary">
          + New Permission
        </Link>
      </div>

      <DataTable data={permissions} columns={columns} searchKey="name" />
    </>
  );
}
