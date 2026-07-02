'use client';

import React from 'react';
import { RoleForm } from '@/components/roles/RoleForm';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function CreateRolePage() {
  const { can } = useAuth();
  if (!can('roles', 'create')) return <NoAccess module="roles" action="create" />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Role</h1>
          <p className="page-subtitle">Add a new role to the system</p>
        </div>
      </div>
      <RoleForm />
    </>
  );
}
