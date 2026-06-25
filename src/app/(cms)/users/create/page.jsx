'use client';

import React from 'react';
import { UserForm } from '@/components/users/UserForm';
import { useApi } from '@/lib/useApi';

export default function CreateUserPage() {
  const { data: rolesData, loading: rolesLoading } = useApi('/roles');

  const roles = rolesData || [];

  if (rolesLoading) {
    return <div className="text-muted" style={{ padding: '24px' }}>Loading...</div>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create User</h1>
          <p className="page-subtitle">Add a new user to the system</p>
        </div>
      </div>
      <UserForm availableRoles={roles} />
    </>
  );
}
