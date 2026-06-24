'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PostListPage() {
  const params = useParams();
  const postType = params.postType || 'post';
  const postTypeLabel = postType === 'news'
    ? 'News'
    : postType === 'event'
      ? 'Events'
      : 'Press Releases';
  const singularPostTypeLabel = postType === 'news'
    ? 'News'
    : postType === 'event'
      ? 'Event'
      : 'Press Release';
  
  // Mock data
  const posts = postType === 'event' ? [
    { id: 1, title: 'Global Developer Summit 2026', start_date: '2026-08-15T09:00:00Z', end_date: '2026-08-17T18:00:00Z', venue: 'Metropolitan Convention Hall', status: 'Upcoming' },
    { id: 2, title: 'Webinar: Intro to Next.js 16', start_date: '2026-06-25T14:30:00Z', end_date: '2026-06-25T16:00:00Z', venue: 'Zoom Online', status: 'Ongoing' },
    { id: 3, title: 'Tailwind CSS Workshop', start_date: '2026-06-10T10:00:00Z', end_date: '2026-06-10T15:00:00Z', venue: 'Tech Hub Room B', status: 'Completed' },
  ] : postType === 'news' ? [
    { id: 1, title: 'Tech Breakthrough of the Year', category: 'Technology', author: 'Dr. Evelyn Carter', status: 'published', publish_date: '2026-06-21T10:00:00Z' },
    { id: 2, title: 'Local Tech Hub Expands', category: 'Local News', author: 'John Editor', status: 'draft', publish_date: '2026-06-22T14:30:00Z' },
  ] : [
    { id: 1, title: 'Acme Corp Announces Strategic Partnership', category: 'Partnerships', status: 'published', publish_date: '2026-06-20T10:00:00Z', featured: 'Yes' },
    { id: 2, title: 'Quarterly Earnings Report Q2', category: 'Financial', status: 'draft', publish_date: '2026-06-21T14:30:00Z', featured: 'No' },
  ];

  const columns = postType === 'event' ? [
    { header: 'Event Name', accessorKey: 'title' },
    {
      header: 'Start Date',
      render: (row) => new Date(row.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      header: 'End Date',
      render: (row) => new Date(row.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    { header: 'Venue', accessorKey: 'venue' },
    {
      header: 'Status',
      render: (row) => {
        const badgeColor = 
          row.status === 'Ongoing' ? 'badge-warning' :
          row.status === 'Upcoming' ? 'badge-primary' :
          row.status === 'Completed' ? 'badge-success' : 'badge-secondary';
        return <span className={`badge ${badgeColor}`}>{row.status}</span>;
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/posts/${postType}/${row.id}/edit`} className="btn btn-secondary btn-sm">
            Edit
          </Link>
        </div>
      ),
    },
  ] : postType === 'news' ? [
    { header: 'Headline', accessorKey: 'title' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Author', render: (row) => row.author || 'Admin' },
    {
      header: 'Publish Date',
      render: (row) => new Date(row.publish_date || row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      header: 'Status',
      render: (row) => {
        const badgeColor = row.status === 'published' ? 'badge-success' : 'badge-warning';
        return <span className={`badge ${badgeColor}`}>{row.status}</span>;
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/posts/${postType}/${row.id}/edit`} className="btn btn-secondary btn-sm">
            Edit
          </Link>
        </div>
      ),
    },
  ] : [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Category', accessorKey: 'category' },
    {
      header: 'Publish Date',
      render: (row) => new Date(row.publish_date || row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      header: 'Status',
      render: (row) => {
        const badgeColor = row.status === 'published' ? 'badge-success' : 'badge-warning';
        return <span className={`badge ${badgeColor}`}>{row.status}</span>;
      }
    },
    {
      header: 'Featured',
      render: (row) => (
        <span className={`badge ${row.featured === 'Yes' ? 'badge-info' : 'badge-danger'}`}>{row.featured || 'No'}</span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/posts/${postType}/${row.id}/edit`} className="btn btn-secondary btn-sm">
            Edit
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">{postTypeLabel}</h1>
          <p className="page-subtitle">Manage your {singularPostTypeLabel.toLowerCase()} content</p>
        </div>
        <Link href={`/posts/${postType}/create`} className="btn btn-primary">
          + New {singularPostTypeLabel}
        </Link>
      </div>

      <DataTable data={posts} columns={columns} searchKey="title" />
    </>
  );
}
