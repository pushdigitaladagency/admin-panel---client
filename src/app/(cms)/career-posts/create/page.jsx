'use client';

import React from 'react';
import { CareerPostForm } from '@/components/careers/CareerPostForm';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function CreateCareerPostPage() {
  const { can } = useAuth();
  if (!can('career_posts', 'create')) return <NoAccess module="career_posts" action="create" />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Career Post</h1>
          <p className="page-subtitle">Add a new job opening</p>
        </div>
      </div>
      <CareerPostForm />
    </>
  );
}
