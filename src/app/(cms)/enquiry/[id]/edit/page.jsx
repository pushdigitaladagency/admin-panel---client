'use client';

import React from 'react';
import { PostForm } from '@/components/posts/PostForm';
import { useParams } from 'next/navigation';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

export default function EditEnquiryPage() {
  const params = useParams();
  const { can } = useAuth();
  const enquiryId = params.id;

  const { data, loading, error } = useApi(`/enquiries/${enquiryId}`);

  if (!can('enquiries', 'edit')) return <NoAccess module="enquiries" action="edit" />;
  if (loading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>;
  if (error) return <p className="form-error" style={{ padding: '32px 0' }}>{error.message || 'Failed to load enquiry'}</p>;
  if (!data) return <p className="text-muted" style={{ padding: '32px 0' }}>Enquiry not found</p>;

  // Map backend fields to PostForm's enquiry field names
  const initialData = {
    id: data.id,
    enquiry_name: data.name || '',
    enquiry_email: data.email || '',
    enquiry_mobile: data.mobile || '',
    enquiry_subject: data.subject || '',
    enquiry_status: data.status || 'New',
    enquiry_message: data.message || '',
    submitted_date: data.created_at ? data.created_at.split('T')[0] : '',
    response_date: data.response_date ? data.response_date.split('T')[0] : '',
    assigned_to: data.assigned_to ? String(data.assigned_to) : '',
    assigned_to_name: data.assignee ? `${data.assignee.first_name || ''} ${data.assignee.last_name || ''}`.trim() : '',
    follow_up_notes: data.follow_up_notes || '',
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="page-title text-2xl font-bold text-gray-900 mb-2">View / Edit Enquiry</h1>
        <p className="page-subtitle text-gray-500">Update the details of the enquiry. Ref: {data.reference_no || `#${data.id}`}</p>
      </div>

      <PostForm postType="enquiry" initialData={initialData} />
    </>
  );
}
