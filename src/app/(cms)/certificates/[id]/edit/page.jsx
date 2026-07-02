'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CertificateForm } from '@/components/certificates/CertificateForm';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function EditCertificatePage() {
  const params = useParams();
  const { can } = useAuth();
  const { data, loading, error } = useApi(`/certificates/${params.id}`);

  if (!can('certificates', 'edit')) return <NoAccess module="certificates" action="edit" />;
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
