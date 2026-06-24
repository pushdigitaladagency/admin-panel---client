import React from 'react';
import { UserForm } from '@/components/users/UserForm';

export const dynamic = 'force-dynamic';

export default function CreateUserPage() {
  const mockRoles = [
    { id: 1, name: 'Superadmin' },
    { id: 2, name: 'Editor' },
    { id: 3, name: 'Author' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create User</h1>
          <p className="page-subtitle">Add a new user to the system</p>
        </div>
      </div>
      <UserForm availableRoles={mockRoles} />
    </>
  );
}
