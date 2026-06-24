'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { TermForm } from '@/components/terms/TermForm';
import { formatTaxonomyLabel } from '@/utils/taxonomyLabels';

export default function CreateTermPage() {
  const params = useParams();
  const taxonomy = params.taxonomy || 'category';
  const taxonomyLabel = formatTaxonomyLabel(taxonomy);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ textTransform: 'capitalize' }}>Create {taxonomyLabel}</h1>
          <p className="page-subtitle">Add a new {taxonomyLabel} to the system</p>
        </div>
      </div>
      <TermForm taxonomy={taxonomy} />
    </>
  );
}
