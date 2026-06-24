'use client';

import React from 'react';
import { PermissionForm } from '@/components/permissions/PermissionForm';

export default function CreatePermissionPage() {
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
