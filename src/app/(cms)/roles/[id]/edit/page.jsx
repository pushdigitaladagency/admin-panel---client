'use client';

import React from 'react';
import { RoleForm } from '@/components/roles/RoleForm';
import { notFound, useParams } from 'next/navigation';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function EditRolePage() {
  const params = useParams();
  const { can } = useAuth();
  const roleId = parseInt(params.id, 10);
  
  if (isNaN(roleId)) return notFound();

  const { data: role, loading: roleLoading, error: roleError } = useApi(`/roles/${roleId}`);
  const { data: rolePermissions, loading: permsLoading } = useApi(`/roles/${roleId}/permissions`);

  const loading = roleLoading || permsLoading;

  if (!can('roles', 'edit')) return <NoAccess module="roles" action="edit" />;
  if (loading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>;
  if (roleError) return <p className="form-error" style={{ padding: '32px 0' }}>{roleError.message || 'Failed to load role'}</p>;
  if (!role) return notFound();

  const initialData = {
    id: role.id,
    name: role.name || '',
    code: role.code || '',
    description: role.description || '',
    status: role.status === false || role.status === 'inactive' ? 'inactive' : 'active',
    permissions: rolePermissions || [],
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Role: {role.name}</h1>
          <p className="page-subtitle">Modify role details and permissions</p>
        </div>
      </div>
      <RoleForm initialData={initialData} />
    </>
  );
}
