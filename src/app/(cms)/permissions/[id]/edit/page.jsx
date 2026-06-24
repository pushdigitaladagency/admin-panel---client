'use client';

import React from 'react';
import { PermissionForm } from '@/components/permissions/PermissionForm';
import { notFound, useParams } from 'next/navigation';

export default function EditPermissionPage() {
  const params = useParams();
  const permissionId = parseInt(params.id, 10);
  
  if (isNaN(permissionId)) return notFound();

  // Mock database permissions
  const mockPermissions = [
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

  const perm = mockPermissions.find(p => p.id === permissionId);
  if (!perm) return notFound();

  // Map to PermissionForm expected fields
  const initialData = {
    id: perm.id,
    group: perm.group,
    name: perm.name.split('.')[1] || perm.name, // e.g. "view" from "post.view"
    code: perm.name, // e.g. "post.view"
    description: perm.description,
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Permission: {perm.name}</h1>
          <p className="page-subtitle">Modify permission details and grouping</p>
        </div>
      </div>
      <PermissionForm initialData={initialData} />
    </>
  );
}
