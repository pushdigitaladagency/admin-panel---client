'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PostForm } from '@/components/posts/PostForm';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';

// Map frontend postType slug to RBAC module code
const POST_MODULE = {
  news: 'news',
  event: 'events',
  'press-release': 'press_releases',
};

export default function CreatePostPage() {
  const params = useParams();
  const postType = params.postType || 'post';
  const { can } = useAuth();
  const moduleCode = POST_MODULE[postType] || 'press_releases';

  if (!can(moduleCode, 'create')) {
    return <NoAccess module={moduleCode} action="create" />;
  }

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
