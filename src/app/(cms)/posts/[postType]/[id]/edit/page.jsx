'use client';

import React from 'react';
import { PostForm } from '@/components/posts/PostForm';
import { notFound, useParams } from 'next/navigation';
import { useApi } from '@/lib/useApi';

// Map frontend postType slug to API path
const POST_API = {
  news: '/news',
  event: '/events',
  'press-release': '/press-releases',
};

export default function EditPostPage() {
  const params = useParams();
  const postType = params.postType || 'post';
  const postId = parseInt(params.id, 10);
  
  if (isNaN(postId)) return notFound();

  const apiPath = POST_API[postType] || '/press-releases';
  const { data, loading, error } = useApi(`${apiPath}/${postId}`);

  if (loading) return <p className="text-muted" style={{ padding: '32px 0' }}>Loading…</p>;
  if (error) return <p className="form-error" style={{ padding: '32px 0' }}>{error.message || 'Failed to load record'}</p>;
  if (!data) return notFound();

  // Map backend fields to the form's expected field names
  let initialData;
  if (postType === 'event') {
    initialData = {
      id: data.id,
      title: data.title || '',
      slug: data.slug || '',
      category: data.event_type_id ? String(data.event_type_id) : '',
      excerpt: data.short_description || '',
      content: data.description || '',
      featured_image: data.banner_image || '',
      event_start_date: data.event_start_date ? data.event_start_date.split('T')[0] : '',
      event_end_date: data.event_end_date ? data.event_end_date.split('T')[0] : '',
      reg_start_date: data.registration_start_date ? data.registration_start_date.split('T')[0] : '',
      reg_end_date: data.registration_end_date ? data.registration_end_date.split('T')[0] : '',
      venue: data.venue || '',
      address: data.address || '',
      map_url: data.google_map_url || '',
      organizer_name: data.organizer_name || '',
      organizer_email: data.organizer_email || '',
      organizer_contact: data.organizer_contact || '',
      registration_link: data.registration_link || '',
      max_participants: data.maximum_participants ? String(data.maximum_participants) : '',
      event_status: data.event_status || 'Upcoming',
      status: (data.publish_status || 'Draft').toLowerCase() === 'published' ? 'published' : 'draft',
      seo_title: data.seo_title || '',
      seo_keywords: data.seo_keywords || '',
      seo_description: data.seo_description || '',
      tags: data.tags || '',
      featured: data.featured ? 'yes' : 'no',
    };
  } else if (postType === 'news') {
    initialData = {
      id: data.id,
      title: data.title || '',
      slug: data.slug || '',
      category: data.category_id ? String(data.category_id) : '',
      excerpt: data.summary || '',
      content: data.full_content || '',
      featured_image: data.featured_image || '',
      news_source: data.news_source || '',
      author: data.author || '',
      publish_date: data.publish_date ? data.publish_date.split('T')[0] : '',
      gallery_images: data.gallery ? data.gallery.map(img => img.image_path).join(',') : '',
      tags: data.tags || '',
      featured: data.featured ? 'yes' : 'no',
      status: (data.status || 'Draft').toLowerCase() === 'published' ? 'published' : 'draft',
      seo_title: data.seo_title || '',
      seo_keywords: data.seo_keywords || '',
      seo_description: data.seo_description || '',
    };
  } else {
    // press release
    initialData = {
      id: data.id,
      title: data.title || '',
      slug: data.slug || '',
      category: data.category_id ? String(data.category_id) : '',
      excerpt: data.short_description || '',
      content: data.detailed_content || '',
      featured_image: data.featured_image || '',
      publish_date: data.publish_date ? data.publish_date.split('T')[0] : '',
      expiry_date: data.expiry_date ? data.expiry_date.split('T')[0] : '',
      attachment: data.attachment || '',
      tags: data.tags || '',
      featured: data.featured ? 'yes' : 'no',
      status: (data.status || 'Draft').toLowerCase() === 'published' ? 'published' : 'draft',
      seo_title: data.seo_title || '',
      seo_keywords: data.seo_keywords || '',
      seo_description: data.seo_description || '',
    };
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit {postType}</h1>
          <p className="page-subtitle">Modify the {postType} content</p>
        </div>
      </div>
      <PostForm initialData={initialData} postType={postType} />
    </>
  );
}
