'use client';

import React from 'react';
import { UserForm } from '@/components/users/UserForm';
import { notFound, useParams } from 'next/navigation';

export default function EditUserPage() {
  const params = useParams();
  const userId = parseInt(params.id, 10);
  
  if (isNaN(userId)) return notFound();

  // Mock data
  const mockRoles = [
    { id: 1, name: 'Superadmin' },
    { id: 2, name: 'Editor' },
    { id: 3, name: 'Author' },
  ];

  const initialData = {
    id: userId,
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com',
    username: 'admin',
    roles: [1],
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit User</h1>
          <p className="page-subtitle">Modify user details and roles</p>
        </div>
      </div>
      <UserForm initialData={initialData} availableRoles={mockRoles} />
    </>
  );
}
