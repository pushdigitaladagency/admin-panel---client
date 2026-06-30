'use client';

import React from 'react';
import { CareerApplicationForm } from '@/components/careers/CareerApplicationForm';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function CreateCareerApplicationPage() {
  const { can } = useAuth();
  if (!can('career_applications', 'create')) return <NoAccess module="career_applications" action="create" />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Application</h1>
          <p className="page-subtitle">Add a candidate application</p>
        </div>
      </div>
      <CareerApplicationForm />
    </>
  );
}
