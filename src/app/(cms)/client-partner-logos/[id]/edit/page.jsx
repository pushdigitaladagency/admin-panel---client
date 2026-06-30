'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ClientPartnerLogoForm } from '@/components/logos/ClientPartnerLogoForm';
import { useApi } from '@/lib/useApi';

export default function EditLogoPage() {
  const params = useParams();
  const { data, loading, error } = useApi(`/client-partner-logos/${params.id}`);

  if (loading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>;
  if (error) return <p className="form-error" style={{ padding: '32px 0' }}>{error.message || 'Failed to load logo'}</p>;
  if (!data) return <p className="text-muted" style={{ padding: '32px 0' }}>Logo not found</p>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Logo</h1>
          <p className="page-subtitle">Update logo details</p>
        </div>
      </div>
      <ClientPartnerLogoForm initialData={data} />
    </>
  );
}
