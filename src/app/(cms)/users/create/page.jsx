'use client';

import React from 'react';
import { UserForm } from '@/components/users/UserForm';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function CreateUserPage() {
  const { can } = useAuth();
  const { data: rolesData, loading: rolesLoading } = useApi('/roles');

  const roles = rolesData || [];

  if (!can('users', 'create')) return <NoAccess module="users" action="create" />;
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
