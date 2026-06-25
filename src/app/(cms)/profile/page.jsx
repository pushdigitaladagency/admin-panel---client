'use client';

import React from 'react';
import { UserForm } from '@/components/users/UserForm';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/lib/useApi';

export default function ProfilePage() {
  const { user, refreshMe } = useAuth();
  const { data: rolesData, loading: rolesLoading } = useApi('/roles');

  const roles = rolesData || [];

  if (!user || rolesLoading) {
    return <div className="text-muted" style={{ padding: '24px' }}>Loading profile…</div>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal information and password</p>
        </div>
      </div>

      <UserForm 
        initialData={user} 
        availableRoles={roles} 
        isProfile={true} 
        onSuccess={refreshMe}
        successPath="/profile" 
        cancelPath="/dashboard" 
      />
    </>
  );
}
