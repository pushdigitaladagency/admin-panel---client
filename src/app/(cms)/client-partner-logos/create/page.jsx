'use client';

import React from 'react';
import { ClientPartnerLogoForm } from '@/components/logos/ClientPartnerLogoForm';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function CreateLogoPage() {
  const { can } = useAuth();
  if (!can('client_partner_logos', 'create')) return <NoAccess module="client_partner_logos" action="create" />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Logo</h1>
          <p className="page-subtitle">Add a client, partner or sponsor logo</p>
        </div>
      </div>
      <ClientPartnerLogoForm />
    </>
  );
}
