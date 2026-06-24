'use client';

import React from 'react';
import { PostForm } from '@/components/posts/PostForm';

export default function CreateEnquiryPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="page-title text-2xl font-bold text-gray-900 mb-2">Create Enquiry</h1>
        <p className="page-subtitle text-gray-500">Fill out the form below to create a new enquiry.</p>
      </div>

      <PostForm postType="enquiry" />
    </>
  );
}
