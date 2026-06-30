'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { InvestorCategoryForm } from '@/components/investors/InvestorCategoryForm';
import { useApi } from '@/lib/useApi';

export default function EditInvestorCategoryPage() {
  const params = useParams();
  const { data, loading, error } = useApi(`/investor-categories/${params.id}`);

  if (loading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>;
  if (error) return <p className="form-error" style={{ padding: '32px 0' }}>{error.message || 'Failed to load category'}</p>;
  if (!data) return <p className="text-muted" style={{ padding: '32px 0' }}>Category not found</p>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Investor Category</h1>
          <p className="page-subtitle">Update category details</p>
        </div>
      </div>
      <InvestorCategoryForm initialData={data} />
    </>
  );
}
