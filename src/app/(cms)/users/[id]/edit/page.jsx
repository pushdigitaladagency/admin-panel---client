'use client';

import React from 'react';
import { UserForm } from '@/components/users/UserForm';
import { notFound, useParams } from 'next/navigation';
import { useApi } from '@/lib/useApi';

export default function EditUserPage() {
  const params = useParams();
  const userId = parseInt(params.id, 10);
  
  if (isNaN(userId)) return notFound();

  const { data: userData, loading: userLoading, error: userError } = useApi(`/users/${userId}`);
  const { data: rolesData, loading: rolesLoading } = useApi('/roles');

  const roles = rolesData || [];

  if (userError) return notFound();
  if (userLoading || rolesLoading) {
    return <div className="text-muted" style={{ padding: '24px' }}>Loading...</div>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit User</h1>
          <p className="page-subtitle">Modify user details and roles</p>
        </div>
      </div>
      <UserForm initialData={userData} availableRoles={roles} />
    </>
  );
}
