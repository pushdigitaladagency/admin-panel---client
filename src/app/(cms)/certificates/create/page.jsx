'use client';

import React from 'react';
import { CertificateForm } from '@/components/certificates/CertificateForm';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function CreateCertificatePage() {
  const { can } = useAuth();
  if (!can('certificates', 'create')) return <NoAccess module="certificates" action="create" />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Certificate</h1>
          <p className="page-subtitle">Add a new certificate</p>
        </div>
      </div>
      <CertificateForm />
    </>
  );
}
