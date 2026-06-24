import React from 'react';
import { RoleForm } from '@/components/roles/RoleForm';

export default function CreateRolePage() {
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
