'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CertificateForm } from '@/components/certificates/CertificateForm';
import { useApi } from '@/lib/useApi';

export default function EditCertificatePage() {
  const params = useParams();
  const { data, loading, error } = useApi(`/certificates/${params.id}`);

  if (loading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>;
  if (error) return <p className="form-error" style={{ padding: '32px 0' }}>{error.message || 'Failed to load certificate'}</p>;
  if (!data) return <p className="text-muted" style={{ padding: '32px 0' }}>Certificate not found</p>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Certificate</h1>
          <p className="page-subtitle">Update certificate details</p>
        </div>
      </div>
      <CertificateForm initialData={data} />
    </>
  );
}
