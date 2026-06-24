'use client';

import React from 'react';
import { PostForm } from '@/components/posts/PostForm';
import { notFound, useParams } from 'next/navigation';

export default function EditPostPage() {
  const params = useParams();
  const postType = params.postType || 'post';
  const postId = parseInt(params.id, 10);
  
  if (isNaN(postId)) return notFound();

  // Mock data
  let initialData = {
    id: postId,
    title: `Mock ${postType} Title`,
    slug: `mock-${postType}-title`,
    content: 'This is the mock content for the post.',
    excerpt: 'This is a mock excerpt.',
    status: 'published',
    category: '',
  };

  if (postType === 'event') {
    initialData = {
      id: postId,
      title: 'Global Developer Summit 2026',
      slug: 'global-developer-summit-2026',
      category: 'Conferences',
      excerpt: 'The premier conference for developers, engineers, and tech leaders.',
      content: '<p>Join us at the <strong>Global Developer Summit 2026</strong> where we will cover cutting-edge technologies, cloud infrastructure, AI integration, and the future of web standards.</p><ul><li>Hands-on Workshops</li><li>Keynote Speeches</li><li>Networking Sessions</li></ul>',
      featured_image: '',
      event_start_date: '2026-08-15',
      event_end_date: '2026-08-17',
      reg_start_date: '2026-06-01',
      reg_end_date: '2026-08-01',
      venue: 'Metropolitan Convention Hall',
      address: '789 Innovation Parkway, San Francisco, CA',
      map_url: 'https://maps.google.com/?q=metropolitan+convention+hall',
      organizer_name: 'DevTech Alliance',
      organizer_email: 'summit@devtechalliance.org',
      organizer_contact: '+1-800-555-0144',
      registration_link: 'https://devtechalliance.org/summit2026',
      max_participants: '500',
      event_status: 'Upcoming',
      status: 'published',
    };
  } else if (postType === 'news') {
    initialData = {
      id: postId,
      title: 'Tech Breakthrough of the Year',
      slug: 'tech-breakthrough-of-the-year',
      category: 'National News',
      excerpt: 'Scientists discover a new superconducting material operating at room temperature.',
      content: '<p>Researchers have announced a breakthrough in material science with the discovery of a stable, room-temperature superconductor. This has massive implications for power transmission, quantum computing, and transportation.</p>',
      news_source: 'Science Daily',
      author: 'Dr. Evelyn Carter',
      publish_date: '2026-06-21',
      featured_image: '',
      gallery_images: '',
      tags: 'science, physics, tech',
      featured: 'yes',
      status: 'published',
    };
  } else {
    // press release
    initialData = {
      id: postId,
      title: 'Acme Corp Announces Strategic Partnership',
      slug: 'acme-corp-announces-strategic-partnership',
      category: 'Press Releases',
      excerpt: 'Acme Corp is proud to partner with Beta Corp to deliver next-generation AI platforms.',
      content: '<p>Acme Corp, a leader in cloud services, today announced a strategic partnership with Beta Corp, pioneers in artificial intelligence models. Together, the companies plan to launch an integrated AI suite in Q4 2026.</p>',
      publish_date: '2026-06-20',
      expiry_date: '2026-12-31',
      featured_image: '',
      attachment: '',
      tags: 'partnership, ai, press',
      featured: 'no',
      status: 'published',
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
