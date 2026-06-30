'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CareerApplicationForm } from '@/components/careers/CareerApplicationForm';
import { useApi } from '@/lib/useApi';

export default function EditCareerApplicationPage() {
  const params = useParams();
  const { data, loading, error } = useApi(`/career-applications/${params.id}`);

  if (loading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>;
  if (error) return <p className="form-error" style={{ padding: '32px 0' }}>{error.message || 'Failed to load application'}</p>;
  if (!data) return <p className="text-muted" style={{ padding: '32px 0' }}>Application not found</p>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">View / Edit Application</h1>
          <p className="page-subtitle">{data.full_name} — {data.applied_position}</p>
        </div>
      </div>
      <CareerApplicationForm initialData={data} />
    </>
  );
}
