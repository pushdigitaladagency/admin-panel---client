'use client';

import React from 'react';
import { RoleForm } from '@/components/roles/RoleForm';
import { notFound, useParams } from 'next/navigation';

export default function EditRolePage() {
  const params = useParams();
  const roleId = parseInt(params.id, 10);
  
  if (isNaN(roleId)) return notFound();

  const initialData = {
    id: roleId,
    name: 'Superadmin',
    code: '10001',
    description: 'System administrator with full access to all settings and modules.',
    status: 'active',
    permissions: [1, 2, 3],
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Role: {initialData.name}</h1>
          <p className="page-subtitle">Modify role details and permissions</p>
        </div>
      </div>
      <RoleForm initialData={initialData} />
    </>
  );
}
