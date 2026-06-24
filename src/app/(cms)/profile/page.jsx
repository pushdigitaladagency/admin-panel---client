import React from 'react';
import { UserForm } from '@/components/users/UserForm';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const mockRoles = [
    { id: 1, name: 'Superadmin' },
    { id: 2, name: 'Editor' },
    { id: 3, name: 'Author' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal information and password</p>
        </div>
      </div>

      <UserForm availableRoles={mockRoles} successPath="/profile" cancelPath="/profile" />
    </>
  );
}
