'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';
import { useApi } from '@/lib/useApi';
import { Pencil } from 'lucide-react';

export default function EnquiryListPage() {
  const { data, loading, error } = useApi('/enquiries');
  const enquiries = data || [];

  const columns = [
    { header: 'Ref #', render: (row) => row.reference_no || `#${row.id}` },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Mobile', accessorKey: 'mobile' },
    { header: 'Subject', accessorKey: 'subject' },
    {
      header: 'Submitted Date',
      render: (row) => row.created_at
        ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—'
    },
    {
      header: 'Status',
      render: (row) => {
        const s = row.status || 'New';
        const badgeColor = s === 'New' ? 'badge-primary' : s === 'In Progress' ? 'badge-warning' : s === 'Responded' ? 'badge-info' : 'badge-success';
        return <span className={`badge ${badgeColor}`}>{s}</span>;
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/enquiry/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1">
            <Pencil size={14} /> View / Edit
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Enquiries</h1>
          <p className="page-subtitle">Manage all enquiries</p>
        </div>
      </div>

      {error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load enquiries'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading enquiries…</p>
      ) : (
        <DataTable columns={columns} data={enquiries} searchKey="name" />
      )}
    </>
  );
}
