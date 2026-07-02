'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ClientPartnerLogoForm } from '@/components/logos/ClientPartnerLogoForm';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function EditLogoPage() {
  const params = useParams();
  const { can } = useAuth();
  const { data, loading, error } = useApi(`/client-partner-logos/${params.id}`);

  if (!can('client_partner_logos', 'edit')) return <NoAccess module="client_partner_logos" action="edit" />;
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
