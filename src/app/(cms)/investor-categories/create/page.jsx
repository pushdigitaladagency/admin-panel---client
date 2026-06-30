'use client';

import React from 'react';
import { InvestorCategoryForm } from '@/components/investors/InvestorCategoryForm';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function CreateInvestorCategoryPage() {
  const { can } = useAuth();
  if (!can('investors', 'create')) return <NoAccess module="investors" action="create" />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Investor Category</h1>
          <p className="page-subtitle">Add a document category</p>
        </div>
      </div>
      <InvestorCategoryForm />
    </>
  );
}
