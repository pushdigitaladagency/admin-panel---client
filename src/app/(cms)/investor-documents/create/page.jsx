'use client';

import React from 'react';
import { InvestorDocumentForm } from '@/components/investors/InvestorDocumentForm';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function CreateInvestorDocumentPage() {
  const { can } = useAuth();
  const { data: categories, loading } = useApi('/investor-categories');

  if (!can('investors', 'create')) return <NoAccess module="investors" action="create" />;
  if (loading) return <div className="text-muted" style={{ padding: '24px' }}>Loading…</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Investor Document</h1>
          <p className="page-subtitle">Add an investor relations document</p>
        </div>
      </div>
      <InvestorDocumentForm categories={categories || []} />
    </>
  );
}
