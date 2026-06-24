'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PostForm } from '@/components/posts/PostForm';

export default function CreatePostPage() {
  const params = useParams();
  const postType = params.postType || 'post';

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create {postType}</h1>
          <p className="page-subtitle">Add a new {postType} to the site</p>
        </div>
      </div>
      <PostForm postType={postType} />
    </>
  );
}
