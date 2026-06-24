import React from 'react';
import { ProfileForm } from '@/components/profile/ProfileForm';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  // Mock data
  const user = {
    id: 1,
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal information and password</p>
        </div>
      </div>

      <ProfileForm user={user} />
    </>
  );
}
