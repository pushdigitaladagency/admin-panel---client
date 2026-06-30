'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MetaMappingForm } from '@/components/meta/MetaMappingForm';
import { useApi } from '@/lib/useApi';

export default function EditMetaMappingPage() {
  const params = useParams();
  const { data, loading, error } = useApi(`/meta-mappings/${params.id}`);

  if (loading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>;
  if (error) return <p className="form-error" style={{ padding: '32px 0' }}>{error.message || 'Failed to load meta mapping'}</p>;
  if (!data) return <p className="text-muted" style={{ padding: '32px 0' }}>Meta mapping not found</p>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Meta Mapping</h1>
          <p className="page-subtitle">{data.url}</p>
        </div>
      </div>
      <MetaMappingForm initialData={data} />
    </>
  );
}
