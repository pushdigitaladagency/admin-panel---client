'use client';

import React from 'react';
import { TermForm } from '@/components/terms/TermForm';
import { notFound, useParams } from 'next/navigation';
import { formatTaxonomyLabel } from '@/utils/taxonomyLabels';
import { taxonomyToApiPath } from '@/utils/taxonomyApi';
import { useApi } from '@/lib/useApi';

export default function EditTermPage() {
  const params = useParams();
  const taxonomy = params.taxonomy || 'category';
  const taxonomyLabel = formatTaxonomyLabel(taxonomy);
  const termId = parseInt(params.id, 10);
  
  if (isNaN(termId)) return notFound();

  const apiPath = taxonomyToApiPath(taxonomy);
  const { data, loading, error } = useApi(`${apiPath}/${termId}`);

  if (loading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>;
  if (error) return <p className="form-error" style={{ padding: '32px 0' }}>{error.message || 'Failed to load term'}</p>;
  if (!data) return notFound();

  const initialData = {
    id: data.id,
    name: data.name || '',
    slug: data.slug || '',
    description: data.description || '',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ textTransform: 'capitalize' }}>Edit {taxonomyLabel}</h1>
          <p className="page-subtitle">Modify term details</p>
        </div>
      </div>
      <TermForm initialData={initialData} taxonomy={taxonomy} />
    </>
  );
}
