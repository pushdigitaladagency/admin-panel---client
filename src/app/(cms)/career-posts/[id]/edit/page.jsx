'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CareerPostForm } from '@/components/careers/CareerPostForm';
import { useApi } from '@/lib/useApi';

export default function EditCareerPostPage() {
  const params = useParams();
  const { data, loading, error } = useApi(`/career-posts/${params.id}`);

  if (loading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>;
  if (error) return <p className="form-error" style={{ padding: '32px 0' }}>{error.message || 'Failed to load career post'}</p>;
  if (!data) return <p className="text-muted" style={{ padding: '32px 0' }}>Career post not found</p>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Career Post</h1>
          <p className="page-subtitle">Update job opening details</p>
        </div>
      </div>
      <CareerPostForm initialData={data} />
    </>
  );
}
