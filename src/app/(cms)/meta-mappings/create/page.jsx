'use client';

import React from 'react';
import { MetaMappingForm } from '@/components/meta/MetaMappingForm';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function CreateMetaMappingPage() {
  const { can } = useAuth();
  if (!can('meta_mappings', 'create')) return <NoAccess module="meta_mappings" action="create" />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Meta Mapping</h1>
          <p className="page-subtitle">Add SEO metadata for a page URL</p>
        </div>
      </div>
      <MetaMappingForm />
    </>
  );
}
