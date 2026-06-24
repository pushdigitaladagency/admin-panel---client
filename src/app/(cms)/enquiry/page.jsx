'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';

export default function EnquiryListPage() {
  const postType = 'enquiry';
  const postTypeLabel = 'Enquiries';
  const singularPostTypeLabel = 'Enquiry';
  
  // Mock data
  const posts = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', mobile: '+91 123-456-7890', subject: 'Interested in Services', status: 'New', date: '2026-06-24T10:00:00Z' },
    { id: 2, name: 'Bob Jones', email: 'bob@example.com', mobile: '+91 098-765-4321', subject: 'Support Request', status: 'In Progress', date: '2026-06-23T14:30:00Z' },
  ];

  const columns = [
    { header: 'Enquiry ID', render: (row) => `#${row.id}` },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Mobile', accessorKey: 'mobile' },
    { header: 'Subject', accessorKey: 'subject' },
    {
      header: 'Submitted Date',
      render: (row) => new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      header: 'Status',
      render: (row) => {
        const badgeColor = row.status === 'New' ? 'badge-primary' : row.status === 'In Progress' ? 'badge-warning' : row.status === 'Responded' ? 'badge-info' : 'badge-success';
        return <span className={`badge ${badgeColor}`}>{row.status}</span>;
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/enquiry/${row.id}/edit`} className="btn btn-secondary btn-sm">
            View / Edit
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
          <p className="page-subtitle">Manage all {postTypeLabel.toLowerCase()}</p>
        </div>
        <Link href={`/enquiry/create`} className="btn btn-primary">
          Create {singularPostTypeLabel}
        </Link>
      </div>

      <div className="card">
        <DataTable columns={columns} data={posts} />
      </div>
    </>
  );
}
