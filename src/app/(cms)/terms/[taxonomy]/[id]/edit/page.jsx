'use client';

import React from 'react';
import { TermForm } from '@/components/terms/TermForm';
import { notFound, useParams } from 'next/navigation';

export default function EditTermPage() {
  const params = useParams();
  const taxonomy = params.taxonomy || 'category';
  const termId = parseInt(params.id, 10);
  
  if (isNaN(termId)) return notFound();

  // Mock data
  const initialData = {
    id: termId,
    name: `Mock ${taxonomy}`,
    slug: `mock-${taxonomy}`,
    description: 'This is a mock description.',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ textTransform: 'capitalize' }}>Edit {taxonomy}</h1>
          <p className="page-subtitle">Modify term details</p>
        </div>
      </div>
      <TermForm initialData={initialData} taxonomy={taxonomy} />
    </>
  );
}
