'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { TermForm } from '@/components/terms/TermForm';

export default function CreateTermPage() {
  const params = useParams();
  const taxonomy = params.taxonomy || 'category';

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ textTransform: 'capitalize' }}>Create {taxonomy.replace(/-/g, ' ')}</h1>
          <p className="page-subtitle">Add a new {taxonomy.replace(/-/g, ' ')} to the system</p>
        </div>
      </div>
      <TermForm taxonomy={taxonomy} />
    </>
  );
}
