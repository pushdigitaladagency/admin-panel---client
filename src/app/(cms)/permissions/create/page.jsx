'use client';

import React from 'react';
import { PermissionForm } from '@/components/permissions/PermissionForm';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function CreatePermissionPage() {
  const { can } = useAuth();
  if (!can('roles', 'create')) return <NoAccess module="roles" action="create" />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Permission</h1>
          <p className="page-subtitle">Add a new permission to the system</p>
        </div>
      </div>
      <PermissionForm />
    </>
  );
}
