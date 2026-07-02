'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { InvestorDocumentForm } from '@/components/investors/InvestorDocumentForm';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function EditInvestorDocumentPage() {
  const params = useParams();
  const { can } = useAuth();
  const { data, loading, error } = useApi(`/investor-documents/${params.id}`);
  const { data: categories, loading: catLoading } = useApi('/investor-categories');

  if (!can('investors', 'edit')) return <NoAccess module="investors" action="edit" />;
  if (loading || catLoading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>;
  if (error) return <p className="form-error" style={{ padding: '32px 0' }}>{error.message || 'Failed to load document'}</p>;
  if (!data) return <p className="text-muted" style={{ padding: '32px 0' }}>Document not found</p>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Investor Document</h1>
          <p className="page-subtitle">Update document details</p>
        </div>
      </div>
      <InvestorDocumentForm initialData={data} categories={categories || []} />
    </>
  );
}
