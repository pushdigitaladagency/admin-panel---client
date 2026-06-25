'use client';

import React from 'react';
import { PermissionForm } from '@/components/permissions/PermissionForm';
import { notFound, useParams } from 'next/navigation';
import { useApi } from '@/lib/useApi';

export default function EditPermissionPage() {
  const params = useParams();
  const permissionId = parseInt(params.id, 10);
  
  if (isNaN(permissionId)) return notFound();

  const { data: perm, loading, error } = useApi(`/permissions/${permissionId}`);

  if (loading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>;
  if (error) return <p className="form-error" style={{ padding: '32px 0' }}>{error.message || 'Failed to load permission'}</p>;
  if (!perm) return notFound();

  const initialData = {
    id: perm.id,
    module_id: perm.module_id || perm.module?.id || '',
    name: perm.name || '',
    code: perm.code || '',
    action: perm.action || '',
    description: perm.description || '',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Permission: {perm.code || perm.name}</h1>
          <p className="page-subtitle">Modify permission details and grouping</p>
        </div>
      </div>
      <PermissionForm initialData={initialData} />
    </>
  );
}
