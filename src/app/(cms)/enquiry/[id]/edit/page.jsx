'use client';

import React from 'react';
import { PostForm } from '@/components/posts/PostForm';
import { useParams } from 'next/navigation';

export default function EditEnquiryPage() {
  const params = useParams();
  
  // Mock data
  const mockInitialData = { 
    id: params.id, 
    enquiry_name: 'Alice Smith', 
    enquiry_email: 'alice@example.com', 
    enquiry_mobile: '123-456-7890', 
    enquiry_subject: 'Interested in Services', 
    enquiry_status: 'New', 
    submitted_date: '2026-06-24',
    enquiry_message: 'I would like to know more about your services.',
    assigned_to: '',
    follow_up_notes: '',
    response_date: ''
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="page-title text-2xl font-bold text-gray-900 mb-2">View / Edit Enquiry</h1>
        <p className="page-subtitle text-gray-500">Update the details of the enquiry.</p>
      </div>

      <PostForm postType="enquiry" initialData={mockInitialData} />
    </>
  );
}
